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

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "user" | "admin";
  avatar_url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  quizId: string;
  completedAt?: string;
  score?: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent?: number;
}

export interface UserAttempt {
  id: string;
  userId: string;
  quizId: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  answers: Record<string, any>;
  quiz?: {
    id: string;
    title: string;
    thumbnail?: string;
  };
}

export interface UserCertificate {
  id: string;
  userId: string;
  certificateId: string;
  earnedAt: string;
  certificate?: {
    id: string;
    name: string;
    description?: string;
    certificate?: string;
  };
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

export const userApi = {
  // ==================== User Profile Routes ====================
  async getUserProfile(): Promise<ApiResponse<User>> {
    return authFetch(`${API_BASE_URL}/users/me`);
  },

  async updateUserProfile(data: FormData): Promise<ApiResponse<User>> {
    return authFetch(`${API_BASE_URL}/users/me`, {
      method: "PUT",
      body: data,
    });
  },

  // ==================== User Progress Routes ====================
  async getUserProgress(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<UserProgress>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const query = searchParams.toString();
    return authFetch(
      `${API_BASE_URL}/users/me/progress${query ? `?${query}` : ""}`
    );
  },

  // ==================== User Attempts Routes ====================
  async getUserAttempts(params?: {
    page?: number;
    limit?: number;
    quizId?: string;
  }): Promise<PaginatedResponse<UserAttempt>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.quizId) searchParams.append("quizId", params.quizId);

    const query = searchParams.toString();
    return authFetch(
      `${API_BASE_URL}/users/me/attempts${query ? `?${query}` : ""}`
    );
  },

  // ==================== User Certificates Routes ====================
  async getUserCertificates(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<UserCertificate>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const query = searchParams.toString();
    return authFetch(
      `${API_BASE_URL}/users/me/certificates${query ? `?${query}` : ""}`
    );
  },

  //dectivate user account
  async deactivateUserAccount(id: string): Promise<ApiResponse> {
    return authFetch(`${API_BASE_URL}/users/${id}`, {
      method: "PATCH",
    });
  },

  // delete user account
  async deleteUser(id: string): Promise<ApiResponse> {
    return authFetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
  },
};
