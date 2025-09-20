// API service for communicating with the RAG backend
const API_BASE_URL = "http://127.0.0.1:8000";

export interface ChatResponse {
  answer: string;
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
};
