
import os
import logging
import re
from fastapi import FastAPI, UploadFile, File
from sentence_transformers import SentenceTransformer
import chromadb
import google.generativeai as genai
from ingres import ingres_excel  # INGRES ingestion function

# Load .env
from dotenv import load_dotenv
load_dotenv()

CHROMA_API_KEY = os.getenv("CHROMA_API_KEY")
CHROMA_TENANT = os.getenv("CHROMA_TENANT")
CHROMA_DATABASE = os.getenv("CHROMA_DATABASE")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("rag_api")

# FastAPI app
app = FastAPI(title="Groundwater RAG Assistant")

# Embeddings model
logger.info("Loading sentence transformer model...")
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# ChromaDB Cloud client
logger.info("Connecting to ChromaDB Cloud...")
client_chroma = chromadb.CloudClient(
    api_key=CHROMA_API_KEY,
    tenant=CHROMA_TENANT,
    database=CHROMA_DATABASE
)
logger.info("ChromaDB Cloud client ready.")

# Gemini LLM
logger.info("Configuring Gemini model...")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

# List of all states for matching
ALL_STATES = [
    "Andaman and Nicobar Islands", "Bihar", "Arunachal Pradesh", "Assam",
    "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
    "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Jammu and Kashmir",
    "Ladakh", "Delhi", "Puducherry"
]

def extract_states_from_query(query: str):
    """Return a list of states found in the query text (case-insensitive)."""
    matched_states = []
    for state in ALL_STATES:
        if re.search(rf"\b{re.escape(state)}\b", query, re.IGNORECASE):
            matched_states.append(state)
    return matched_states

def query_pipeline(user_query: str):
    """Query state-wise collections automatically based on states in the query."""
    logger.info(f"Received query: {user_query}")
    query_embedding = embedder.encode(user_query).tolist()
    logger.info("Query embedded successfully.")

    # Extract states from query
    states_list = extract_states_from_query(user_query)
    if not states_list:
        logger.warning("No state detected in query, defaulting to all collections.")
        states_list = ALL_STATES

    # Retrieve from state collections
    all_contexts = []
    for state in states_list:
        collection_name = f"ingres_{state.replace(' ', '_').upper()}"
        try:
            collection = client_chroma.get_or_create_collection(collection_name)
        except Exception as e:
            logger.warning(f"Collection {collection_name} not found or error: {e}")
            continue
        
        logger.info(f"Collecting info for {state}")
        results = collection.query(query_embeddings=[query_embedding], n_results=100)
        for docs in results["documents"]:
            if docs:  # only non-empty lists
                all_contexts.extend(docs)
                logger.info(f"Retrieved {len(docs)} docs from {collection_name}")

    context_str = "\n".join(all_contexts)
    logger.info(f"Aggregated context length: {len(context_str)} characters")

    # Call Gemini
    prompt = f"Query: {user_query}\n\nContext:\n{context_str}"
    response = model.generate_content(prompt)
    logger.info("Generated response from Gemini.")

    return response.text

@app.get("/ask")
async def ask(query: str):
    answer = query_pipeline(query)
    return {"answer": answer}

@app.post("/ingres")
async def run_ingres(file: UploadFile = File(None)):
    """
    Run INGRES ingestion.
    - Upload a file to use it
    - If no file uploaded, uses default groundwater.xlsx
    """
    if file:
        file_path = f"./temp_{file.filename}"
        with open(file_path, "wb") as f:
            f.write(await file.read())
        logger.info(f"Running INGRES with uploaded file: {file.filename}")
        ingres_excel(file_path)
    else:
        logger.info("Running INGRES with default file: groundwater.xlsx")
        ingres_excel("groundwater.xlsx")

    return {"status": "INGRES pipeline completed"}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting FastAPI app on http://127.0.0.1:8000")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
