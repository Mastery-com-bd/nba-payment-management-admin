import { config } from "@/config";
import { TStudent } from "../types/student.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;








// Helper function for authenticated requests
const authFetch = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
    },
  });
  return response.json();
};

// Helper function for public requests
const publicFetch = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  return response.json();
};

 // ==================== Public package Routes ====================
export const packageApi = { 
  async getAllPacakges(params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
      if (params?.searchTerm)
        searchParams.append("searchTerm", params.searchTerm);
    const query = searchParams.toString();
    return publicFetch(`${API_BASE_URL}/package/${query ? `?${query}` : ""}`, {
      method: "GET",
      credentials: "include",
    });
  },

//   async getQuizById(id: string): Promise<ApiResponse<Quiz>> {
//     return publicFetch(`${API_BASE_URL}/quizzes/${id}`);
//   },

//   // ==================== Authenticated Quiz Routes ====================
//   async startQuiz(id: string, data?: any): Promise<ApiResponse<QuizAttempt>> {
//     return authFetch(`${API_BASE_URL}/quizzes/${id}/start`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data || {}),
//     });
//   },

//   async submitQuiz(
//     id: string,
//     data: {
//       answers: Record<string, any>;
//       timeSpent?: number;
//     },
//   ): Promise<ApiResponse<QuizAttempt>> {
//     return authFetch(`${API_BASE_URL}/quizzes/${id}/submit`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//   },
};
