import os
from dotenv import load_dotenv
import logging
import pandas as pd
from sentence_transformers import SentenceTransformer
import chromadb

# Load .env
load_dotenv()
CHROMA_API_KEY = os.getenv("CHROMA_API_KEY")
CHROMA_TENANT = os.getenv("CHROMA_TENANT")
CHROMA_DATABASE = os.getenv("CHROMA_DATABASE")

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("rag_ingres")

BATCH_SIZE = 100  # batch size for collection.add


def clear_collection_safe(collection, collection_name):
    """Safely clear previous data in a Chroma collection."""
    try:
        all_ids = [doc_id for doc_id in collection.get(include=["ids"])["ids"]]
        if all_ids:
            collection.delete(ids=all_ids)
            logger.info(f"Cleared previous data in collection: {collection_name}")
        else:
            logger.info(f"No previous data to clear in collection: {collection_name}")
    except Exception as e:
        logger.warning(f"Could not clear previous data in collection {collection_name}: {e}")


def ingres_excel(file_path="data_sih.xlsx"):
    logger.info(f"Starting INGRES pipeline from file: {file_path}")

    # Load Excel
    try:
        df = pd.read_excel(file_path, header=1)
        df.columns = df.columns.str.strip()
        logger.info(f"Columns after stripping: {df.columns.tolist()}")
        logger.info(f"Excel loaded successfully with {len(df)} rows.")
    except Exception as e:
        logger.error(f"Failed to read Excel file: {e}")
        return

    # ChromaDB Cloud client
    logger.info("Connecting to ChromaDB Cloud...")
    client = chromadb.CloudClient(
        api_key=CHROMA_API_KEY,
        tenant=CHROMA_TENANT,
        database=CHROMA_DATABASE
    )
    logger.info("Connected to ChromaDB Cloud.")

    # Embedding model
    logger.info("Loading embedding model (all-MiniLM-L6-v2)...")
    embedder = SentenceTransformer("all-MiniLM-L6-v2")
    logger.info("Embedding model loaded.")

    # Group by state
    states = df["State"].unique()
    logger.info(f"Found {len(states)} unique states. Processing each state separately...")

    for state in states:
        state_df = df[df["State"] == state]
        collection_name = f"state_{state.replace(' ', '_')}"
        logger.info(f"Processing state: {state} | Collection: {collection_name}")

        # Get or create collection for this state
        collection = client.get_or_create_collection(collection_name)

        # Clear previous data safely
        clear_collection_safe(collection, collection_name)

        # Prepare batches
        documents_batch = []
        embeddings_batch = []
        ids_batch = []

        for idx, row in state_df.iterrows():
            location = f"{row['District']}, {row['State']}"
            text = (
                f"Location: {location}, Year: 2025, "
                f"Rainfall Total: {row['Rainfall(Total)']}, "
                f"Rainfall Recharge: {row['Rainfall Recharge']}, "
                f"Groundwater Recharge: {row['Groundwater Recharge']}, "
                f"Category: Water Resources"
            )
            embedding = embedder.encode(text).tolist()

            documents_batch.append(text)
            embeddings_batch.append(embedding)
            ids_batch.append(str(idx))

            # If batch full, send to Chroma
            if len(documents_batch) >= BATCH_SIZE:
                collection.add(
                    documents=documents_batch,
                    embeddings=embeddings_batch,
                    ids=ids_batch
                )
                logger.info(f"Processed {idx + 1} rows for state {state} (batch sent)")
                documents_batch, embeddings_batch, ids_batch = [], [], []

        # Send remaining batch
        if documents_batch:
            collection.add(
                documents=documents_batch,
                embeddings=embeddings_batch,
                ids=ids_batch
            )
            logger.info(f"Processed {len(state_df)} rows for state {state} (final batch)")

        logger.info(f"✅ Completed ingestion for state: {state}")

    logger.info(f"✅ INGRES pipeline completed. Total rows: {len(df)}")


if __name__ == "__main__":
    ingres_excel()
