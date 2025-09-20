# import os
# import logging
# import pandas as pd
# import numpy as np
# import chromadb
# from sentence_transformers import SentenceTransformer
# from dotenv import load_dotenv
# import math

# # Load .env
# load_dotenv()

# CHROMA_API_KEY = os.getenv("CHROMA_API_KEY")
# CHROMA_TENANT = os.getenv("CHROMA_TENANT")
# CHROMA_DATABASE = os.getenv("CHROMA_DATABASE")
# DATA_FILE = "data_sihh.csv"

# logging.basicConfig(
#     format="%(asctime)s | %(levelname)s | %(message)s",
#     level=logging.INFO,
# )
# logger = logging.getLogger("rag_ingres")

# def clean_metadata_value(val, numeric_default=None, string_default=""):
#     """Ensure metadata values are JSON-serializable for ChromaDB."""
#     if pd.isna(val):
#         if numeric_default is not None:
#             return numeric_default
#         return string_default
#     if isinstance(val, (np.int64, np.int32)):
#         return int(val)
#     if isinstance(val, (np.float64, np.float32)):
#         return float(val)
#     if isinstance(val, str):
#         return val.strip()
#     return str(val)

# def ingres_excel():
#     logger.info(f"Starting INGRES pipeline from file: {DATA_FILE}")

#     # Load dataset
#     df = pd.excel(DATA_FILE, header = 0)
#     df.columns = [c.strip() for c in df.columns]
#     logger.info(f"Columns after stripping: {df.columns.tolist()}")
#     logger.info(f"CSV loaded successfully with {len(df)} rows.")

#     # Connect to ChromaDB
#     logger.info("Connecting to ChromaDB Cloud...")
#     client = chromadb.CloudClient(
#         api_key=CHROMA_API_KEY,
#         tenant=CHROMA_TENANT,
#         database=CHROMA_DATABASE,
#     )
#     logger.info("ChromaDB Cloud client ready.")

#     # Load embedding model
#     logger.info("Loading embedding model (all-MiniLM-L6-v2)...")
#     embedder = SentenceTransformer("all-MiniLM-L6-v2")
#     logger.info("Embedding model loaded.")

#     # Ensure Year column exists
#     if "Year" not in df.columns:
#         logger.error("No 'Year' column found in dataset.")
#         return

#     years = df["Year"].unique()
#     logger.info(f"Found unique years: {years}")

#     # Determine numeric columns automatically
#     numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

#     for year in years:
#         collection_name = f"test_1.0_{year}"

#         # Drop old collection (clear DB at start)
#         try:
#             client.delete_collection(name=collection_name)
#             logger.info(f"Cleared old collection: {collection_name}")
#         except Exception:
#             logger.info(f"No existing collection to clear: {collection_name}")

#         # Create collection
#         collection = client.get_or_create_collection(collection_name)
#         logger.info(f"Using collection: {collection_name}")

#         # Filter rows by year
#         year_df = df[df["Year"] == year]

#         for idx, row in year_df.iterrows():
#             text = (
#                 f"State: {row['State']}, District: {row['District']}, "
#                 f"Rainfall(Total): {row['Rainfall(Total)']}, "
#                 f"Rainfall Recharge: {row['Rainfall Recharge']}, "
#                 f"Groundwater Recharge: {row['Groundwater Recharge (ham)']}, "
#                 f"Surface Water Irrigation: {row['Surface Water Irrigation']}, "
#                 f"Ground Water Irrigation: {row['Ground Water Irrigation']}, "
#                 f"Fresh Total Ground Water Available: {row['Fresh Total Ground Water Avialable']}, "
#                 f"Saline Ground Water Available: {row['Saline Ground Water Avialable']}, "
#                 f"Year: {row['Year']}"
#             )
#             embedding = embedder.encode(text).tolist()

#             metadata = {}
#             for col in df.columns:
#                 if col in numeric_cols:
#                     metadata[col] = clean_metadata_value(row[col], numeric_default=0)
#                 else:
#                     metadata[col] = clean_metadata_value(row[col], string_default="")

#             collection.add(
#                 documents=[text],
#                 embeddings=[embedding],
#                 metadatas=[metadata],
#                 ids=[f"{year}_{idx}"],
#             )

#             if idx % 100 == 0 and idx != 0:
#                 logger.info(f"Inserted {idx} rows into {collection_name}")

#         logger.info(f"✅ Completed ingestion for year {year}, rows: {len(year_df)}")


# if __name__ == "__main__":
#     ingres_excel()

import os
import logging
import pandas as pd
import numpy as np
import chromadb
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

# Load .env
load_dotenv()

CHROMA_API_KEY = os.getenv("CHROMA_API_KEY")
CHROMA_TENANT = os.getenv("CHROMA_TENANT")
CHROMA_DATABASE = os.getenv("CHROMA_DATABASE")
DATA_FILE = "data_sihh.xlsx"

logging.basicConfig(
    format="%(asctime)s | %(levelname)s | %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger("rag_ingres")

def clean_metadata_value(val, numeric_default=None, string_default=""):
    """Ensure metadata values are JSON-serializable for ChromaDB."""
    if pd.isna(val):
        if numeric_default is not None:
            return numeric_default
        return string_default
    if isinstance(val, (np.int64, np.int32)):
        return int(val)
    if isinstance(val, (np.float64, np.float32)):
        return float(val)
    if isinstance(val, str):
        return val.strip()
    return str(val)

def batch_upload(collection, embedder, df, batch_size=100):
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

    documents, embeddings, metadatas, ids = [], [], [], []

    for idx, row in df.iterrows():
        text = (
            f"State: {row['State']}, District: {row['District']}, "
            f"Rainfall(Total): {row['Rainfall(Total)']}, "
            f"Rainfall Recharge: {row['Rainfall Recharge']}, "
            f"Groundwater Recharge: {row['Groundwater Recharge (ham)']}, "
            f"Surface Water Irrigation: {row['Surface Water Irrigation']}, "
            f"Ground Water Irrigation: {row['Ground Water Irrigation']}, "
            f"Fresh Total Ground Water Available: {row['Fresh Total Ground Water Avialable']}, "
            f"Saline Ground Water Available: {row['Saline Ground Water Avialable']}, "
            f"Year: {row['year']}"
        )
        embedding = embedder.encode(text).tolist()

        metadata = {}
        for col in df.columns:
            if col in numeric_cols:
                metadata[col] = clean_metadata_value(row[col], numeric_default=0)
            else:
                metadata[col] = clean_metadata_value(row[col], string_default="")

        documents.append(text)
        embeddings.append(embedding)
        metadatas.append(metadata)
        ids.append(f"{row['year']}_{idx}")

        # Upload in batches
        if len(documents) >= batch_size:
            collection.add(
                documents=documents,
                embeddings=embeddings,
                metadatas=metadatas,
                ids=ids,
            )
            logger.info(f"Inserted {len(ids)} rows so far...")
            documents, embeddings, metadatas, ids = [], [], [], []

    # Upload remaining rows
    if documents:
        collection.add(
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids,
        )
        logger.info(f"Inserted final batch of {len(ids)} rows.")

def ingres_excel():
    logger.info(f"Starting INGRES pipeline from file: {DATA_FILE}")

    # Load dataset
    df = pd.read_excel(DATA_FILE, header=0)
    df.columns = [c.strip() for c in df.columns]
    logger.info(f"Columns after stripping: {df.columns.tolist()}")
    logger.info(f"Excel loaded successfully with {len(df)} rows.")

    # Connect to ChromaDB
    logger.info("Connecting to ChromaDB Cloud...")
    client = chromadb.CloudClient(
        api_key=CHROMA_API_KEY,
        tenant=CHROMA_TENANT,
        database=CHROMA_DATABASE,
    )
    logger.info("ChromaDB Cloud client ready.")

    # Load embedding model
    logger.info("Loading embedding model (all-MiniLM-L6-v2)...")
    embedder = SentenceTransformer("all-MiniLM-L6-v2")
    logger.info("Embedding model loaded.")

    # Ensure Year column exists
    if "year" not in df.columns:
        logger.error("No 'Year' column found in dataset.")
        return

    # Drop old collection (clear DB at start)
    collection_name = "test_2.0"
    try:
        client.delete_collection(name=collection_name)
        logger.info(f"Cleared old collection: {collection_name}")
    except Exception:
        logger.info(f"No existing collection to clear: {collection_name}")

    # Create a single collection
    collection = client.get_or_create_collection(collection_name)
    logger.info(f"Using collection: {collection_name}")

    # Batch upload
    batch_upload(collection, embedder, df, batch_size=100)

    logger.info(f"✅ Completed ingestion, total rows: {len(df)}")


if __name__ == "__main__":
    ingres_excel()
