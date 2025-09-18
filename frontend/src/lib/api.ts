// API service for communicating with the RAG backend
const API_BASE_URL = "http://127.0.0.1:8000";

export interface ChatResponse {
  answer: string;
}

export const chatAPI = {
  async askQuestion(query: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/ask?query=${encodeURIComponent("You are a ground water Assistant Officer. Your knowledge spans all the contextual data given here. Give the answer in minimal lines possible as I am extracting your response to a chatbot. Do not add any formatting in the response at all, no bold or numbered lists. If you have a data over 15 rows, plot it in a table first for the user in a table format using dashes and underscores, else return in plain text or array format, then try to do all the calculations requested in the backend and output the final answer, try to be as accurate as possilbe and double check your answer. Last thing to note, if the question is in another language, try to get teh answer in the same language as asked. Here is the Query along with Context:"+query)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error calling RAG API:', error);
      throw error;
    }
  },

  async runIngres(file?: File): Promise<{ status: string }> {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    
    const response = await fetch(`${API_BASE_URL}/ingres`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
};
