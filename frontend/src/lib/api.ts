// API service for communicating with the RAG backend
const API_BASE_URL = "http://127.0.0.1:8000";

export interface ChatResponse {
  answer: string;
}

export interface VoiceTranscribeResponse {
  transcribed_text: string;
  status: string;
  error?: string;
}

export interface VoiceAskResponse {
  transcribed_text: string;
  answer: string;
  status: string;
  error?: string;
}

export interface VoiceSpeakResponse {
  audio_data: string;
  text: string;
  status: string;
  error?: string;
}

export interface VoiceCompleteResponse {
  transcribed_text: string;
  answer: string;
  audio_data: string;
  status: string;
  error?: string;
}

export const chatAPI = {
  async askQuestion(query: string, persona: string, language: string): Promise<ChatResponse> {
    try {
      const url = `${API_BASE_URL}/ask?query=${encodeURIComponent(query)}&persona=${encodeURIComponent(persona)}&language=${encodeURIComponent(language)}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error calling RAG API:", error);
      throw error;
    }
  },

  async runIngres(file?: File): Promise<{ status: string }> {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }

    const response = await fetch(`${API_BASE_URL}/ingres`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Voice API methods
  async transcribeAudio(audioFile: File): Promise<VoiceTranscribeResponse> {
    const formData = new FormData();
    formData.append("audio_file", audioFile);

    const response = await fetch(`${API_BASE_URL}/voice/transcribe`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  async voiceAsk(audioFile: File, persona: string, language: string): Promise<VoiceAskResponse> {
    const formData = new FormData();
    formData.append("audio_file", audioFile);
    formData.append("persona", persona);
    formData.append("language", language);

    const response = await fetch(`${API_BASE_URL}/voice/ask`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  async textToSpeech(text: string, language: string): Promise<VoiceSpeakResponse> {
    const formData = new FormData();
    formData.append("text", text);
    formData.append("language", language);

    const response = await fetch(`${API_BASE_URL}/voice/speak`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

    async completeVoiceInteraction(audioFile: File, persona: string, language: string): Promise<VoiceCompleteResponse> {
        const formData = new FormData();
        formData.append("audio_file", audioFile);
        formData.append("persona", persona);
        formData.append("language", language);

        const response = await fetch(`${API_BASE_URL}/voice/complete`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    },

    async debugVoiceProcessing(audioFile: File): Promise<any> {
        const formData = new FormData();
        formData.append("audio_file", audioFile);

        const response = await fetch(`${API_BASE_URL}/voice/debug`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    },
};
