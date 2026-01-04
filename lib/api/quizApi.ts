const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data?: T[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  thumbnail?: string;
  difficulty?: string;
  timeLimit?: number;
  questions?: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  answers: Record<string, any>;
}

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

export const quizApi = {
  // ==================== Public Quiz Routes ====================
  async getAllQuizzes(params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
  }): Promise<PaginatedResponse<Quiz>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.categoryId) searchParams.append("categoryId", params.categoryId);

    const query = searchParams.toString();
    return publicFetch(`${API_BASE_URL}/quizzes${query ? `?${query}` : ""}`);
  },

  async getQuizById(id: string): Promise<ApiResponse<Quiz>> {
    return publicFetch(`${API_BASE_URL}/quizzes/${id}`);
  },

  // ==================== Authenticated Quiz Routes ====================
  async startQuiz(id: string, data?: any): Promise<ApiResponse<QuizAttempt>> {
    return authFetch(`${API_BASE_URL}/quizzes/${id}/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data || {}),
    });
  },

  async submitQuiz(
    id: string,
    data: {
      answers: Record<string, any>;
      timeSpent?: number;
    }
  ): Promise<ApiResponse<QuizAttempt>> {
    return authFetch(`${API_BASE_URL}/quizzes/${id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
};