# INGRES AI - Groundwater Resource Information System

A chatbot-based groundwater data query system using RAG (Retrieval-Augmented Generation) with ChromaDB and Google Gemini AI.

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- ChromaDB Cloud account
- Google Gemini API key

### 1. Backend Setup (RAG API)

#### Windows:

```bash
# Run the backend startup script
start-backend.bat
```

#### Linux/Mac:

```bash
# Make script executable and run
chmod +x start-backend.sh
./start-backend.sh
```

#### Manual Setup:

```bash
# Navigate to RAG API directory
cd ingres_SIH-master/ingres-rag-api

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

### 2. Frontend Setup

#### Windows:

```bash
# Run the frontend startup script
start-frontend.bat
```

#### Linux/Mac:

```bash
# Make script executable and run
chmod +x start-frontend.sh
./start-frontend.sh
```

#### Manual Setup:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in `ingres_SIH-master/ingres-rag-api/` with your credentials:

```env
# ChromaDB Cloud Configuration
CHROMA_API_KEY=your_chroma_api_key_here
CHROMA_TENANT=your_chroma_tenant_here
CHROMA_DATABASE=your_chroma_database_here

# Google Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

### Getting API Keys

1. **ChromaDB Cloud**: Sign up at [chroma.cloud](https://chroma.cloud) and get your API key, tenant ID, and database name.

2. **Google Gemini**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

## 📊 Data Ingestion

To ingest groundwater data into ChromaDB:

1. Place your Excel file in `ingres_SIH-master/ingres-rag-api/`
2. Run the ingestion endpoint:

```bash
curl -X POST "http://127.0.0.1:8000/ingres" -F "file=@your_data.xlsx"
```

Or use the default `data_sih.xlsx` file by calling:

```bash
curl -X POST "http://127.0.0.1:8000/ingres"
```

## 🎯 Usage

1. **Start Backend**: Run `start-backend.bat` (Windows) or `./start-backend.sh` (Linux/Mac)
2. **Start Frontend**: Run `start-frontend.bat` (Windows) or `./start-frontend.sh` (Linux/Mac)
3. **Open Browser**: Navigate to `http://localhost:5173`
4. **Ask Questions**: Type queries about groundwater data in the chat interface

### Example Queries

- "What is the groundwater status of Maharashtra?"
- "Show me critical blocks in Tamil Nadu"
- "Groundwater trend analysis for the last 5 years"
- "Safe extraction limits for my area"

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   RAG API       │    │   ChromaDB     │
│   (React/Vite)  │◄──►│   (FastAPI)     │◄──►│   Cloud        │
│   Port: 5173    │    │   Port: 8000    │    │                │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Google Gemini │
                       │   AI Model      │
                       └─────────────────┘
```

## 📁 Project Structure

```
groundwater-guru-main/
├── ingres_SIH-master/
│   └── ingres-rag-api/          # Backend RAG API
│       ├── main.py              # FastAPI server
│       ├── ingres.py            # Data ingestion logic
│       ├── data_sih.xlsx        # Sample groundwater data
│       ├── requirements.txt     # Python dependencies
│       └── .env                 # Environment variables
├── src/
│   ├── frontend/                # Frontend components
│   │   ├── components/          # React components
│   │   └── pages/              # Page components
│   └── lib/
│       └── api.ts              # API service functions
├── start-backend.bat/.sh       # Backend startup scripts
├── start-frontend.bat/.sh      # Frontend startup scripts
└── README.md                   # This file
```

## 🔍 API Endpoints

### Backend API (http://127.0.0.1:8000)

- `GET /ask?query={your_question}` - Ask questions about groundwater data
- `POST /ingres` - Ingest new data files (optional file upload)

### Example API Usage

```bash
# Ask a question
curl "http://127.0.0.1:8000/ask?query=What%20is%20the%20groundwater%20status%20of%20Maharashtra?"

# Ingest data
curl -X POST "http://127.0.0.1:8000/ingres" -F "file=@data.xlsx"
```

## 🛠️ Development

### Backend Development

- The RAG API uses FastAPI for the web server
- Sentence transformers for embeddings
- ChromaDB for vector storage
- Google Gemini for LLM responses

### Frontend Development

- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn/ui for components

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**

   - Check if Python 3.8+ is installed
   - Verify virtual environment is activated
   - Ensure all dependencies are installed
   - Check .env file exists with valid credentials

2. **Frontend won't start**

   - Check if Node.js 18+ is installed
   - Run `npm install` to install dependencies
   - Check if port 5173 is available

3. **API connection errors**

   - Ensure backend is running on port 8000
   - Check browser console for CORS errors
   - Verify API endpoints are accessible

4. **ChromaDB connection issues**
   - Verify API key, tenant, and database name
   - Check internet connection
   - Ensure ChromaDB Cloud account is active

## 📝 License

This project is for educational and research purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions, please check the troubleshooting section or create an issue in the repository.
