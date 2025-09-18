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


def ingres_excel(file_path="data_sih.xlsx"):
    logger.info(f"Starting INGRES pipeline from file: {file_path}")

    # Load Excel
    try:
        df = pd.read_excel(file_path, header=1)
        df.columns = df.columns.str.strip()  # removes leading/trailing spaces
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
    collection = client.get_or_create_collection("ingres_groundwater")
    logger.info("ChromaDB Cloud collection ready: ingres_groundwater")

    # Clear old data
    logger.info("Skip clearing old data in db")
    # collection.delete(where={"_id": {"$exists": True}})
    # logger.info("Old collection data cleared.")

    # Embedding model
    logger.info("Loading embedding model (all-MiniLM-L6-v2)...")
    embedder = SentenceTransformer("all-MiniLM-L6-v2")
    logger.info("Embedding model loaded.")

    # Ingest rows
    # for idx, row in df.iterrows():
    #     text = (
    #         f"Location: {row['Location']}, Year: {row['Year']}, "
    #         f"Recharge: {row['Recharge']}, Category: {row['Category']}"
    #     )
    #     embedding = embedder.encode(text).tolist()

    #     collection.add(
    #         documents=[text],
    #         embeddings=[embedding],
    #         ids=[str(idx)],
    #     )

    #     if idx % 50 == 0 and idx != 0:
    #         logger.info(f"Processed {idx} rows so far...")

    logger.info("Processing Excel")

    for idx, row in df.iterrows():
        location = f"{row['District']}, {row['State']}"
        text = (
            f"Location: {location}, Year: 2025, "
            f"Rainfall Total: {row['Rainfall(Total)']}, "
            f"Rainfall Recharge: {row['Rainfall Recharge']}, "
            f"Groundwater Recharge: {row['Groundwater Recharge']}, "
            f"Category: Water Resources"
        )
        embedding = embedder.encode(text).tolist()

        collection.add(
            documents=[text],
            embeddings=[embedding],
            ids=[str(idx)],
        )

        if idx % 50 == 0 and idx != 0:
            logger.info(f"Processed {idx} rows so far...")

    logger.info(f"✅ INGRES pipeline completed. Total rows: {len(df)}")


if __name__ == "__main__":
    ingres_excel()
