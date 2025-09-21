@echo off
echo 🎤 Installing Voice Feature Dependencies...

echo 📦 Installing Python packages...
pip install SpeechRecognition pyttsx3 pyaudio soundfile librosa numpy

if %errorlevel% equ 0 (
    echo ✅ Voice dependencies installed successfully!
    echo.
    echo 🎯 Next steps:
    echo 1. Restart your backend server: python main.py
    echo 2. Test voice features in your frontend
    echo.
    echo 🎉 Voice features should now work without errors!
) else (
    echo ❌ Installation failed. Please check the error messages above.
    echo.
    echo 🔧 Troubleshooting:
    echo - Make sure you have Python 3.7+ installed
    echo - Try running: pip install --upgrade pip
    echo - For pyaudio issues, try: pip install pipwin ^&^& pipwin install pyaudio
    echo - Or download pyaudio wheel from: https://www.lfd.uci.edu/~gohlke/pythonlibs/#pyaudio
)

pause
