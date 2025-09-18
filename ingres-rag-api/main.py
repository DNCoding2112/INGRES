import os
import logging
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
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

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or restrict: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
# collection = client_chroma.get_or_create_collection("ingres_groundwater")
collection = client_chroma.get_or_create_collection("groundwater_and_rainfall_data")
# logger.info("ChromaDB Cloud collection ready: ingres_groundwater")
logger.info("ChromaDB Cloud collection ready: groundwater_and_rainfall_data")


# Gemini LLM
logger.info("Configuring Gemini model...")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")


def query_pipeline(user_query: str):
    logger.info(f"Received query: {user_query}")

    # Step 1: Embed query
    query_embedding = embedder.encode(user_query).tolist()
    logger.info("Query embedded successfully.")

    # Step 2: Retrieve from Chroma
    results = collection.query(query_embeddings=[query_embedding], n_results=300)
    logger.info(results)
    context = "\n".join(results["documents"][0]) if results["documents"] else ""
    logger.info("Retrieved context from ChromaDB.")

    # Step 3: Call Gemini
    prompt = f"Query: {user_query} ; do all computations(if any) abstractly and only display output in one sentence to end user.\n\nContext:\n{context}"
    response = model.generate_content(prompt)
    logger.info("Generated response from Gemini.")

    return response.text


@app.get("/ask")
async def ask(query: str):
    logger.info(f"API call to /ask with query: {query}")
    answer = query_pipeline(query)
    logger.info("Returning response to client.")
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
