import os
import logging
import speech_recognition as sr
from pydub import AudioSegment

logger = logging.getLogger(__name__)

class VoiceProcessor:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        
    async def process_voice(self, file_path: str, save_dir="temp_audio"):
        """Voice processing pipeline with audio normalization"""
        # Ensure absolute paths
        file_path = os.path.abspath(file_path)
        wav_path = file_path.replace('.webm', '.wav')
        
        try:
            # Verify source file exists
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"Source file not found: {file_path}")
                
            # Convert to WAV
            audio = AudioSegment.from_file(file_path, format="webm")
            
            # --- NEW: NORMALIZE AUDIO VOLUME ---
            # Set a target volume. -20.0 dBFS is a good standard for speech.
            target_dBFS = -20.0
            change_in_dBFS = target_dBFS - audio.dBFS
            normalized_audio = audio.apply_gain(change_in_dBFS)
            # --- END OF NEW CODE ---
            
            # Set frame rate and channels on the NEW normalized audio
            processed_audio = normalized_audio.set_frame_rate(16000).set_channels(1)
            
            # Ensure target directory exists
            os.makedirs(os.path.dirname(wav_path), exist_ok=True)
            
            # Export the new, processed audio
            processed_audio.export(
                wav_path,
                format="wav",
                parameters=[
                    "-acodec", "pcm_s16le",
                    "-ac", "1",
                    "-ar", "16000"
                ]
            )
            
            # Verify WAV file was created
            if not os.path.exists(wav_path):
                raise FileNotFoundError(f"WAV conversion failed: {wav_path}")
            
            # Transcribe
            with sr.AudioFile(wav_path) as source:
                audio_data = self.recognizer.record(source)
                # Using recognize_whisper for high accuracy
                text = self.recognizer.recognize_whisper(audio_data, 
        model="small", 
        )
                return text.strip() if text else "" # Return empty string instead of None
                
        except Exception as e:
            logger.error(f"Voice processing error: {e}")
            # Return an empty string on failure so the main app doesn't crash
            return ""
            
        finally:
            # Cleanup WAV file
            try:
                if wav_path and os.path.exists(wav_path):
                    os.remove(wav_path)
            except Exception as e:
                logger.warning(f"Failed to remove WAV file: {e}")