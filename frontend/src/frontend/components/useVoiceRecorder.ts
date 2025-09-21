// src/frontend/components/useVoiceRecorder.ts

import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

// Define the structure of messages that the hook will return
interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  chartData?: any;
}

// Define the arguments the hook will accept
interface VoiceRecorderProps {
  persona: string;
  language: string;
  onTranscriptionComplete: (userMessage: Message, aiResponse: Message | Message[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useVoiceRecorder = ({ persona, language, onTranscriptionComplete, setIsLoading }: VoiceRecorderProps) => {
  const [isListening, setIsListening] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const handleVoiceInput = async (audioBlob: Blob) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      // We create a file from the blob to send to the backend
      const audioFile = new File([audioBlob], "voice_input.webm", { 
        type: "audio/webm;codecs=opus" 
      });
      formData.append("audio_file", audioFile);
      formData.append("persona", persona);
      formData.append("language", language);
  
      const response = await fetch("http://127.0.0.1:8000/voice/complete", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        // Handle server errors more gracefully
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      
      if (result.status === "success" && result.transcribed_text) {
        // --- Create messages to send back to the main component ---
        const userMessage: Message = {
          id: Date.now().toString(),
          content: `<div>${result.transcribed_text}</div>`,
          isUser: true,
          timestamp: new Date(),
        };

        const aiMessages: Message[] = [];
        const responseData = result.answer; // This is the object { html_answer, chart_data }
        
        if (responseData.html_answer) {
            aiMessages.push({
                id: (Date.now() + 1).toString(),
                content: `<div>${responseData.html_answer}</div>`,
                isUser: false,
                timestamp: new Date(),
            });
        }
        if (responseData.chart_data) {
            aiMessages.push({
                id: (Date.now() + 2).toString(),
                content: "",
                chartData: responseData.chart_data,
                isUser: false,
                timestamp: new Date(),
            });
        }
        
        // Use the callback to update the state in the main component
        onTranscriptionComplete(userMessage, aiMessages);

      } else {
        throw new Error(result.error || "Voice processing failed on the server.");
      }
    } catch (error: any) {
      console.error("Error processing voice input:", error);
      toast({
        title: "Voice Processing Error",
        description: error.message || "Failed to process voice input. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: 'audio/webm;codecs=opus' };
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      audioChunksRef.current = [];
  
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
  
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        await handleVoiceInput(audioBlob);
        stream.getTracks().forEach(track => track.stop()); // Clean up the stream
      };
  
      mediaRecorderRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Microphone Error",
        description: "Could not access the microphone. Please check your browser permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  // Return the state and function the component will need
  return { isListening, handleVoiceToggle };
};