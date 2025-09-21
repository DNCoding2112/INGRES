#!/bin/bash
# install_voice_deps.sh - Install voice feature dependencies

echo "🎤 Installing Voice Feature Dependencies..."

# Install Python dependencies
echo "📦 Installing Python packages..."
pip install SpeechRecognition pyttsx3 pyaudio soundfile librosa numpy

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Voice dependencies installed successfully!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Restart your backend server: python main.py"
    echo "2. Test voice features in your frontend"
    echo ""
    echo "🎉 Voice features should now work without errors!"
else
    echo "❌ Installation failed. Please check the error messages above."
    echo ""
    echo "🔧 Troubleshooting:"
    echo "- Make sure you have Python 3.7+ installed"
    echo "- Try running: pip install --upgrade pip"
    echo "- For pyaudio issues on Windows, try: pip install pipwin && pipwin install pyaudio"
    echo "- For macOS, you might need: brew install portaudio"
fi
