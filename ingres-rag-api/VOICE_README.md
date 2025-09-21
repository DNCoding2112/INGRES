# Voice-Enabled Groundwater RAG Assistant

This FastAPI application provides a RAG (Retrieval-Augmented Generation) chatbot for groundwater data with voice capabilities. The system uses ChromaDB for vector storage, Gemini LLM for responses, and includes speech-to-text and text-to-speech functionality.

## Features

### Core Features

- **RAG-based Chatbot**: Query groundwater data using natural language
- **Multi-language Support**: English, Hindi, Marathi, Tamil, Telugu, Kannada, Bengali, Gujarati, Punjabi
- **Persona-based Responses**: Professional Assistant, Field Technician, Research Analyst
- **Analytics Dashboard**: View predictions for different states and districts

### Voice Features (NEW!)

- **Speech-to-Text**: Convert audio files to text using Whisper
- **Text-to-Speech**: Convert text responses to audio
- **Complete Voice Interaction**: Full voice-to-voice pipeline
- **Multi-language Voice Support**: Voice features work with all supported languages

## Installation

1. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

2. **Install Audio Dependencies** (if needed):

   ```bash
   # For Windows
   pip install pyaudio

   # For macOS
   brew install portaudio
   pip install pyaudio

   # For Linux
   sudo apt-get install python3-pyaudio
   pip install pyaudio
   ```

3. **Set up Environment Variables**:
   Create a `.env` file with:

   ```
   CHROMA_API_KEY=your_chroma_api_key
   CHROMA_TENANT=your_chroma_tenant
   CHROMA_DATABASE=your_chroma_database
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the Application**:
   ```bash
   python main.py
   ```

## API Endpoints

### Core Chatbot Endpoints

- `GET /ask` - Text-based query
- `POST /ingres` - Data ingestion
- `GET /get_locations` - Get available states/districts
- `GET /get_predictions` - Get predictions for location

### Voice Endpoints (NEW!)

- `POST /voice/transcribe` - Convert audio file to text
- `POST /voice/ask` - Voice query (audio → text → answer)
- `POST /voice/speak` - Convert text to speech
- `POST /voice/complete` - Complete voice interaction (audio → text → answer → speech)

## Voice API Usage

### 1. Transcribe Audio

```bash
curl -X POST "http://127.0.0.1:8000/voice/transcribe" \
  -F "audio_file=@your_audio_file.wav"
```

### 2. Voice Query

```bash
curl -X POST "http://127.0.0.1:8000/voice/ask" \
  -F "audio_file=@your_audio_file.wav" \
  -F "persona=Groundwater Assistant" \
  -F "language=English"
```

### 3. Text to Speech

```bash
curl -X POST "http://127.0.0.1:8000/voice/speak" \
  -d "text=Hello, this is a test" \
  -d "language=English"
```

### 4. Complete Voice Interaction

```bash
curl -X POST "http://127.0.0.1:8000/voice/complete" \
  -F "audio_file=@your_audio_file.wav" \
  -F "persona=Groundwater Assistant" \
  -F "language=English"
```

## Frontend Demo

Open `voice_demo.html` in your browser to test the voice features with a user-friendly interface.

## Supported Audio Formats

The voice features support common audio formats:

- WAV
- MP3
- M4A
- FLAC
- OGG

## Language Support

### Text Languages

- English
- Hindi
- Marathi
- Tamil
- Telugu
- Kannada
- Bengali
- Gujarati
- Punjabi

### Voice Features

- Speech-to-text works best with English audio
- Text-to-speech supports all text languages
- Voice responses are generated in the specified language

## Personas

1. **Professional Assistant**: Short, precise, businesslike responses
2. **Field Technician**: Moderately detailed with practical depth
3. **Research Analyst**: Comprehensive, in-depth analysis

## Error Handling

The voice features include comprehensive error handling:

- Audio file validation
- Transcription errors
- Speech generation errors
- Network connectivity issues
- Temporary file cleanup

## Troubleshooting

### Common Issues

1. **PyAudio Installation Issues**:

   - Windows: Use pre-compiled wheels or install Visual Studio Build Tools
   - macOS: Install portaudio via Homebrew first
   - Linux: Install system audio libraries

2. **Whisper Recognition Issues**:

   - Ensure audio quality is good
   - Use clear English speech
   - Check audio file format compatibility

3. **Text-to-Speech Issues**:
   - Verify system has available voices
   - Check language support
   - Ensure sufficient disk space for temp files

## Development

To extend the voice features:

1. **Add New Languages**: Update language mappings in `query_pipeline()`
2. **Custom Voice Settings**: Modify `text_to_speech()` function
3. **Audio Processing**: Enhance `transcribe_audio()` for better accuracy
4. **Error Handling**: Add specific error types in voice endpoints

## License

This project is part of the INGRES groundwater data analysis system.
