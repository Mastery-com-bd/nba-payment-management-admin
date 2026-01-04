import {
  Analytics,
  ApiResponse,
  Category,
  PaginatedResponse,
  Quiz,
  User,
} from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface FunFact {
  id: string;
  title: string;
  content: string;
  image?: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  quiz_id: string;
  certificate_url: string;
  score_achieved: number;
  issued_at: string;
  user?: User;
  quiz?: Quiz;
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

export const adminApi = {
  // ==================== Category Routes ====================
  async getAllCategories(params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
  }): Promise<PaginatedResponse<Category>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.searchTerm) searchParams.append("searchTerm", params.searchTerm);

    const query = searchParams.toString();
    return authFetch(`${API_BASE_URL}/admin/categories${query ? `?${query}` : ""}`);
  },

  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    return authFetch(`${API_BASE_URL}/admin/categories/${id}`);
  },

  async createCategory(data: {
    name: string;
    description?: string;
    icon_url?: string;
    display_order?: number;
    is_active?: boolean;
  }): Promise<ApiResponse<Category>> {
    return authFetch(`${API_BASE_URL}/admin/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async updateCategory(
    id: string,
    data: { name?: string; description?: string }
  ): Promise<ApiResponse<Category>> {
    return authFetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async deleteCategory(id: string): Promise<ApiResponse> {
    return authFetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: "DELETE",
    });
  },

  // ==================== Quiz Routes ====================
  async getAllQuizzes(params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    searchTerm?: string;
  }): Promise<PaginatedResponse<Quiz>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.categoryId) searchParams.append("categoryId", params.categoryId);
    if (params?.searchTerm) searchParams.append("searchTerm", params.searchTerm);

    const query = searchParams.toString();
    return authFetch(`${API_BASE_URL}/admin/quizzes${query ? `?${query}` : ""}`);
  },

  async getQuizById(id: string): Promise<ApiResponse<Quiz>> {
    return authFetch(`${API_BASE_URL}/admin/quizzes/${id}`);
  },

  async createQuiz(data: FormData): Promise<ApiResponse<Quiz>> {
    return authFetch(`${API_BASE_URL}/admin/quizzes`, {
      method: "POST",
      body: data,
    });
  },

  async updateQuiz(id: string, data: FormData): Promise<ApiResponse<Quiz>> {
    return authFetch(`${API_BASE_URL}/admin/quizzes/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  async deleteQuiz(id: string): Promise<ApiResponse> {
    return authFetch(`${API_BASE_URL}/admin/quizzes/${id}`, {
      method: "DELETE",
    });
  },

  // ==================== Fun Facts Routes ====================
  async getAllFunFacts(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<FunFact>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const query = searchParams.toString();
    return authFetch(
      `${API_BASE_URL}/admin/funfacts${query ? `?${query}` : ""}`
    );
  },

  async getFunFactById(id: string): Promise<ApiResponse<FunFact>> {
    return authFetch(`${API_BASE_URL}/admin/funfacts/${id}`);
  },

  async createFunFact(data: FormData): Promise<ApiResponse<FunFact>> {
    return authFetch(`${API_BASE_URL}/admin/funfacts`, {
      method: "POST",
      body: data,
      credentials: "include",
    });
  },

  async updateFunFact(
    id: string,
    data: FormData
  ): Promise<ApiResponse<FunFact>> {
    return authFetch(`${API_BASE_URL}/admin/funfacts/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  async deleteFunFact(id: string): Promise<ApiResponse> {
    return authFetch(`${API_BASE_URL}/admin/funfacts/${id}`, {
      method: "DELETE",
    });
  },

  // ==================== Certificate Routes ====================
  async getAllCertificates(params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
  }): Promise<PaginatedResponse<Certificate>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.searchTerm) searchParams.append("searchTerm", params.searchTerm);

    const query = searchParams.toString();
    return authFetch(`${API_BASE_URL}/admin/certificates${query ? `?${query}` : ""}`);
  },

  async getCertificateById(id: string): Promise<ApiResponse<Certificate>> {
    return authFetch(`${API_BASE_URL}/admin/certificates/${id}`);
  },

  async createCertificate(data: FormData): Promise<ApiResponse<Certificate>> {
    return authFetch(`${API_BASE_URL}/admin/certificates`, {
      method: "POST",
      body: data,
    });
  },

  async updateCertificate(
    id: string,
    data: FormData
  ): Promise<ApiResponse<Certificate>> {
    return authFetch(`${API_BASE_URL}/admin/certificates/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  async deleteCertificate(id: string): Promise<ApiResponse> {
    return authFetch(`${API_BASE_URL}/admin/certificates/${id}`, {
      method: "DELETE",
    });
  },

  // ==================== Analytics Routes ====================
  async getAnalytics(): Promise<ApiResponse<Analytics>> {
    return authFetch(`${API_BASE_URL}/admin/analytics`, { method: "GET" });
  },

  async getMonthlyGrowth(): Promise<ApiResponse<any[]>> {
    return authFetch(`${API_BASE_URL}/admin/analytics/monthly-growth`);
  },

  async getDailyActivity(): Promise<ApiResponse<any[]>> {
    return authFetch(`${API_BASE_URL}/admin/analytics/daily-activity`);
  },

  async getEngagementTrend(): Promise<ApiResponse<any[]>> {
    return authFetch(`${API_BASE_URL}/admin/analytics/engagement-trend`);
  },

  // ==================== User Management Routes ====================
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    searchTerm?: string;
  }): Promise<PaginatedResponse<User>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.role) searchParams.append("role", params.role);
    if (params?.searchTerm) searchParams.append("searchTerm", params.searchTerm);

    const query = searchParams.toString();
    return authFetch(`${API_BASE_URL}/admin/users${query ? `?${query}` : ""}`);
  },

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return authFetch(`${API_BASE_URL}/admin/users/${id}`);
  },
};
