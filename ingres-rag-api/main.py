# import os
# import logging
# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# from sentence_transformers import SentenceTransformer
# import chromadb
# import google.generativeai as genai
# from ingres import ingres_excel  # INGRES ingestion function
# from googletrans import Translator
# import pandas as pd

# # Load .env
# from dotenv import load_dotenv
# load_dotenv()

# CHROMA_API_KEY = os.getenv("CHROMA_API_KEY")
# CHROMA_TENANT = os.getenv("CHROMA_TENANT")
# CHROMA_DATABASE = os.getenv("CHROMA_DATABASE")
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# # Logging setup
# logging.basicConfig(
#     level=logging.INFO,
#     format="%(asctime)s | %(levelname)s | %(message)s",
#     datefmt="%H:%M:%S",
# )
# logger = logging.getLogger("rag_api")

# # FastAPI app
# app = FastAPI(title="Groundwater RAG Assistant")

# # ================== PREDICTION API DATA LOADING START ==================
# # This block loads the prediction data when the server starts.
# try:
#     predictions_df = pd.read_csv('all_predictions.csv')
#     logger.info("Successfully loaded 'all_predictions.csv'.")
# except FileNotFoundError:
#     logger.warning("WARNING: 'all_predictions.csv' not found. Run 'generate_predictions.py' to create it.")
#     predictions_df = pd.DataFrame()
# # =================== PREDICTION API DATA LOADING END ===================

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # or restrict: ["http://localhost:3000"]
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Translator
# translator = Translator()

# # Embeddings model
# logger.info("Loading sentence transformer model...")
# embedder = SentenceTransformer("all-MiniLM-L6-v2")

# # ChromaDB Cloud client
# logger.info("Connecting to ChromaDB Cloud...")
# client_chroma = chromadb.CloudClient(
#     api_key=CHROMA_API_KEY,
#     tenant=CHROMA_TENANT,
#     database=CHROMA_DATABASE
# )
# collection = client_chroma.get_or_create_collection("test_2.0")
# logger.info("ChromaDB Cloud collection ready: test_2.0")

# # Gemini LLM
# logger.info("Configuring Gemini model...")
# genai.configure(api_key=GEMINI_API_KEY)
# model = genai.GenerativeModel("gemini-2.0-flash")

# # Translator function
# def translate_to_english(text: str) -> str:
#     try:
#         translated = translator.translate(text, dest="en")
#         return translated.text
#     except Exception as e:
#         logger.warning(f"Translation failed, using original text. Error: {e}")
#         return text

# def query_pipeline(user_query: str, persona: str, language: str):
#     logger.info(f"Received query: {user_query} | Persona: {persona} | Language: {language}")

#     # Step 0: Translate to English before embedding (since DB is English-only)
#     english_query = translate_to_english(user_query)
#     logger.info(f"Translated query: {english_query}")

#     # Step 1: Embed query
#     query_embedding = embedder.encode(user_query).tolist()
#     logger.info("Query embedded successfully.")

#     # Step 2: Retrieve from Chroma
#     results = collection.query(query_embeddings=[query_embedding], n_results=60)
#     context = "\n".join(results["documents"][0]) if results["documents"] else ""
#     logger.info("Retrieved context from ChromaDB.")

#     # Step 3: Build prompt with persona + language
#     if persona == "Professional Assistant":
#         style = (
#             "Respond in a short, precise, and businesslike manner. "
#             "Focus only on the essential details, avoid unnecessary elaboration, "
#             "and keep the tone formal and professional."
#         )
#     elif persona == "Field Technician":
#         style = (
#             "Respond in a moderately detailed way with practical depth. "
#             "Include step-by-step reasoning or instructions when relevant, "
#             "highlight common pitfalls or best practices, "
#             "and maintain a clear but approachable tone as if explaining to a colleague on site."
#         )
#     elif persona == "Research Analyst":
#         style = (
#             "Respond in a comprehensive, in-depth manner. "
#             "Examine the query from multiple perspectives, "
#             "include reasoning, comparisons, and implications, "
#             "and provide a structured explanation that reflects analytical thinking. "
#             "The tone should be formal, evidence-based, and methodical."
#         )
#     else:
#         style = ""

#     prompt = (
#         f"You are acting as: {persona}. "
#         "Strictly DO NOT ANSWER ANY OTHER QUESTIONS OTHER THAN RELATED TO GROUNDWATER AND MAKE SURE TO RETURN THE RESPONSE AS I CANNOT ASSIST YOU WITH THIS REQUEST IN CASE ANY REQUEST IS SENT THAT IS OUT OF SCOPE OF CONTEXTUAL DATA, OR INDIAN GROUNDWATER/RAINFALL DATA IN GENERAL."
#         f"Answer the following query in {language}. "
#         "Keep it in proper formatted html content only, and accurately. Please make sure that new paragraphs and new sentences start at a new line to ensure formatting is clean."
#         "If data spans over 15 rows, format as 'Key: value' lines instead of a table. "
#         f"{style} "
#         f"\n\nQuery: {user_query}\n\nContext:\n{context}"
#     )


#     response = model.generate_content(prompt)
#     logger.info("Generated response from Gemini.")
#     return response.text


# @app.get("/ask")
# async def ask(query: str, persona: str = "Groundwater Assistant", language: str = "English"):
#     logger.info(f"API call to /ask with query={query}, persona={persona}, language={language}")
#     answer = query_pipeline(query, persona, language)
#     logger.info("Returning response to client.")
#     return {"answer": answer}


# @app.post("/ingres")
# async def run_ingres(file: UploadFile = File(None)):
#     """
#     Run INGRES ingestion.
#     - Upload a file to use it
#     - If no file uploaded, uses default groundwater.xlsx
#     """
#     if file:
#         file_path = f"./temp_{file.filename}"
#         with open(file_path, "wb") as f:
#             f.write(await file.read())
#         logger.info(f"Running INGRES with uploaded file: {file.filename}")
#         ingres_excel(file_path)
#     else:
#         logger.info("Running INGRES with default file: groundwater.xlsx")
#         ingres_excel("groundwater.xlsx")

#     return {"status": "INGRES pipeline completed"}



# # ================== PREDICTION API ROUTES START ==================
# # These are the new endpoints for your Analytics page.

# @app.get("/get_locations")
# async def get_locations():
#     """Endpoint to get a list of all states and their districts for the frontend dropdowns."""
#     if predictions_df.empty:
#         return {"error": "Prediction data not found on server."}
        
#     locations = {}
#     for _, row in predictions_df[['State', 'District']].drop_duplicates().iterrows():
#         state = row['State']
#         district = row['District']
#         if state not in locations:
#             locations[state] = []
#         locations[state].append(district)
#     return locations

# @app.get("/get_predictions")
# async def get_predictions(state: str, district: str):
#     """Endpoint to get predictions for a specific state and district."""
#     if predictions_df.empty:
#         return {"error": "Prediction data not found on server."}

#     result_df = predictions_df[(predictions_df['State'] == state) & (predictions_df['District'] == district)]
    
#     if result_df.empty:
#         return {"error": "No data found for the selected location."}

#     pivoted_df = result_df.pivot(index='Year', columns='Parameter', values='Predicted_Value').reset_index()
#     # FastAPI automatically converts this to JSON
#     result_json = pivoted_df.to_dict(orient='records')
    
#     return result_json

# # =================== PREDICTION API ROUTES END ===================


# if __name__ == "__main__":
#     import uvicorn
#     logger.info("Starting FastAPI app on http://127.0.0.1:8000")
#     uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

import os
import logging
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
import chromadb
import google.generativeai as genai
from ingres import ingres_excel  # INGRES ingestion function
from googletrans import Translator
import pandas as pd
from voice_processor import VoiceProcessor
import time
from visualization_helper import generate_response_and_chart
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

# ================== PREDICTION API DATA LOADING START ==================
# This block loads the prediction data when the server starts.
try:
    predictions_df = pd.read_csv('all_predictions.csv')
    logger.info("Successfully loaded 'all_predictions.csv'.")
except FileNotFoundError:
    logger.warning("WARNING: 'all_predictions.csv' not found. Run 'generate_predictions.py' to create it.")
    predictions_df = pd.DataFrame()
# =================== PREDICTION API DATA LOADING END ===================

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)
# Translator
translator = Translator()

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
collection = client_chroma.get_or_create_collection("test_2.0")
logger.info("ChromaDB Cloud collection ready: test_2.0")

# Gemini LLM
logger.info("Configuring Gemini model...")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

voice_processor = VoiceProcessor()
logger.info("Voice processor initialized")
logger.info("Configuring Gemini model...")
# Translator function
async def translate_to_english(text: str) -> str:
    try:
        translated = await translator.translate(text, dest="en")
        return translated.text
    except Exception as e:
        logger.warning(f"Translation failed, using original text. Error: {e}")
        return text

async def query_pipeline(user_query: str, persona: str, language: str):
    logger.info(f"Received query: {user_query} | Persona: {persona} | Language: {language}")

    # Step 0: Translate to English before embedding (since DB is English-only)
    english_query = await translate_to_english(user_query)
    logger.info(f"Translated query: {english_query}")

    # Step 1: Embed query
    query_embedding = embedder.encode(english_query).tolist()
    logger.info("Query embedded successfully.")

    # Step 2: Retrieve from Chroma
    results = collection.query(query_embeddings=[query_embedding], n_results=60)
    context = "\n".join(results["documents"][0]) if results["documents"] else ""
    logger.info("Retrieved context from ChromaDB.")

    # Step 3: Build prompt with persona + language
    if persona == "Professional Assistant":
        style = (
            "Respond in a short, precise, and businesslike manner. "
            "Focus only on the essential details, avoid unnecessary elaboration, "
            "and keep the tone formal and professional."
        )
    elif persona == "Field Technician":
        style = (
            "Respond in a moderately detailed way with practical depth. "
            "Include step-by-step reasoning or instructions when relevant, "
            "highlight common pitfalls or best practices, "
            "and maintain a clear but approachable tone as if explaining to a colleague on site."
        )
    elif persona == "Research Analyst":
        style = (
            "Respond in a comprehensive, in-depth manner. "
            "Examine the query from multiple perspectives, "
            "include reasoning, comparisons, and implications, "
            "and provide a structured explanation that reflects analytical thinking. "
            "The tone should be formal, evidence-based, and methodical."
        )
    else:
        style = ""

    # Map language to appropriate language code for translation
    language_code = {
        "English": "en",
        "Hindi": "hi",
        "Marathi": "mr",
        "Tamil": "ta",
        "Telugu": "te",
        "Kannada": "kn",
        "Bengali": "bn",
        "Gujarati": "gu",
        "Punjabi": "pa"
    }.get(language, "en")

    # Define error messages for out-of-scope queries
    error_messages = {
        "English": "<div>I can only assist with queries related to groundwater and Indian groundwater/rainfall data. Please ask a relevant question.</div>",
        "Hindi": "<div>मैं केवल भूजल और भारतीय भूजल/वर्षा डेटा से संबंधित प्रश्नों में सहायता कर सकता हूँ। कृपया एक प्रासंगिक प्रश्न पूछें।</div>",
        "Marathi": "<div>मी फक्त भूजल आणि भारतीय भूजल/पावसाच्या डेटाशी संबंधित प्रश्नांमध्ये मदत करू शकतो. कृपया एक संबंधित प्रश्न विचारा.</div>",
        "Tamil": "<div>நான் நிலத்தடி நீர் மற்றும் இந்திய நிலத்தடி நீர்/மழை தரவு தொடர்பான கேள்விகளுக்கு மட்டுமே உதவ முடியும். தொடர்புடைய கேள்வியைக் கேளுங்கள்.</div>",
        "Telugu": "<div>నేను భూగర్భ జలం మరియు భారతీయ భూగర్భ జలం/వర్షపాతం డేటాకు సంబంధించిన ప్రశ్నలకు మాత్రమే సహాయం చేయగలను. దయచేసి సంబంధిత ప్రశ్న అడగండి.</div>",
        "Kannada": "<div>ನಾನು ಭೂಗರ್ಭ ಜಲ ಮತ್ತು ಭಾರತೀಯ ಭೂಗರ್ಭ ಜಲ/ಮಳೆ ಡೇಟಾಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಪ್ರಶ್ನೆಗಳಿಗೆ ಮಾತ್ರ ಸಹಾಯ ಮಾಡಬಹುದು. ದಯವಿಟ್ಟು ಸಂಬಂಧಿತ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ.</div>",
        "Bengali": "<div>আমি কেবল ভূগর্ভস্থ জল এবং ভারতীয় ভূগর্ভস্থ জল/বৃষ্টিপাতের তথ্য সম্পর্কিত প্রশ্নে সহায়তা করতে পারি। দয়া করে একটি প্রাসঙ্গিক প্রশ্ন জিজ্ঞাসা করুন।</div>",
        "Gujarati": "<div>હું ફક્ત ભૂગર્ભજળ અને ભારતીય ભૂગર્ભજળ/વરસાદ ડેટા સંબંધિત પ્રશ્નોમાં મદદ કરી શકું છું. કૃપા કરીને સંબંધિત પ્રશ્ન પૂછો.</div>",
        "Punjabi": "<div>ਮੈਂ ਸਿਰਫ ਭੂ-ਜਲ ਅਤੇ ਭਾਰਤੀ ਭੂ-ਜਲ/ਬਾਰਸ਼ ਡੇਟਾ ਨਾਲ ਸਬੰਧਤ ਸਵਾਲਾਂ ਵਿੱਚ ਹੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਸੰਬੰਧਿਤ ਸਵਾਲ ਪੁੱਛੋ।</div>"
    }

    prompt = (
        f"You are acting as: {persona}. "
        "Strictly DO NOT ANSWER ANY OTHER QUESTIONS OTHER THAN RELATED TO GROUNDWATER AND MAKE SURE TO RETURN THE RESPONSE AS: "
        f"'{error_messages[language]}' IN CASE ANY REQUEST IS SENT THAT IS OUT OF SCOPE OF CONTEXTUAL DATA, OR INDIAN GROUNDWATER/RAINFALL DATA IN GENERAL. "
        f"Answer the following query in {language} with language code {language_code}. "
        "Keep it in proper formatted HTML content only, and accurately. Please make sure that new paragraphs and new sentences start at a new line to ensure formatting is clean. "
        "If data spans over 15 rows, format as 'Key: value' lines instead of a table. "
        f"{style} "
        f"\n\nQuery: {user_query}\n\nContext:\n{context}"
    )
# The replacement is this call to the helper function
    structured_response = generate_response_and_chart(
        model=model,
        user_query=user_query,
        context=context,
        persona=persona,
        language=language
    )

    return structured_response

@app.get("/ask")
async def ask(query: str, persona: str = "Groundwater Assistant", language: str = "English"):
    logger.info(f"API call to /ask with query={query}, persona={persona}, language={language}")
    # 'await' tells Python to wait for the async function to finish and give back the result
    answer = await query_pipeline(query, persona, language) 
    logger.info("Returning structured response to client.")
    return {"answer": answer}
@app.post("/ingres")
async def run_ingres(file: UploadFile = File(None)):
    if file:
        file_path = f"./temp_{file.filename}"
        with open(file_path, "wb") as f: f.write(await file.read())
        logger.info(f"Running INGRES with uploaded file: {file.filename}")
        ingres_excel(file_path)
    else:
        logger.info("Running INGRES with default file: groundwater.xlsx")
        ingres_excel("groundwater.xlsx")
    return {"status": "INGRES pipeline completed"}



@app.post("/voice/complete")
async def complete_voice_interaction(
    audio_file: UploadFile = File(...),
    persona: str = "Groundwater Assistant",
    language: str = "English"
):
    temp_dir = os.path.join(os.getcwd(), "temp_audio")
    temp_file = None
    
    try:
        # Create temp directory if it doesn't exist
        os.makedirs(temp_dir, exist_ok=True)
        
        # Generate unique filename using timestamp
        timestamp = int(time.time() * 1000)
        temp_file = os.path.join(temp_dir, f"voice_input_{timestamp}.webm")
        
        # Save uploaded file with unique name
        content = await audio_file.read()
        with open(temp_file, "wb") as f:
            f.write(content)
            f.flush()
            os.fsync(f.fileno())
        
        # Process the audio using file path
        text = await voice_processor.process_voice(temp_file)
        
        if not text:
            return {"error": "No speech detected", "status": "error"}
            
        # Get answer using existing pipeline
        answer = await query_pipeline(text, persona, language)
        
        return {
            "transcribed_text": text,
            "answer": answer,
            "status": "success"
        }
        
    except Exception as e:
        logger.error(f"Voice interaction failed: {e}")
        return {"error": str(e), "status": "error"}
        
    finally:
        # Cleanup temp files
        try:
            if temp_file and os.path.exists(temp_file):
                os.remove(temp_file)
            if os.path.exists(temp_dir) and not os.listdir(temp_dir):
                os.rmdir(temp_dir)
        except Exception as e:
            logger.warning(f"Cleanup failed: {e}")
@app.get("/get_locations")
async def get_locations():
    """Endpoint to get a list of all states and their districts for the frontend dropdowns."""
    if predictions_df.empty:
        return {"error": "Prediction data not found on server."}
        
    locations = {}
    for _, row in predictions_df[['State', 'District']].drop_duplicates().iterrows():
        state = row['State']
        district = row['District']
        if state not in locations:
            locations[state] = []
        locations[state].append(district)
    return locations

@app.get("/get_predictions")
async def get_predictions(state: str, district: str):
    """Endpoint to get predictions for a specific state and district."""
    if predictions_df.empty:
        return {"error": "Prediction data not found on server."}

    result_df = predictions_df[(predictions_df['State'] == state) & (predictions_df['District'] == district)]
    
    if result_df.empty:
        return {"error": "No data found for the selected location."}

    pivoted_df = result_df.pivot(index='Year', columns='Parameter', values='Predicted_Value').reset_index()
    # FastAPI automatically converts this to JSON
    result_json = pivoted_df.to_dict(orient='records')
    
    return result_json

# =================== PREDICTION API ROUTES END ===================


if __name__ == "__main__":
    import uvicorn
    logger.info("Starting FastAPI app on http://127.0.0.1:8000")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)