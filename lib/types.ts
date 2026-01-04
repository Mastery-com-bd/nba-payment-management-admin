export type UserRole = "user" | "admin";
export type DifficultyLevel = "easy" | "medium" | "hard";
export type QuestionType = "multiple_choice" | "checkbox" | "yes_no";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data?: T[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
  };
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  address?: string;
  phone_number?: string;
  bio?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Quiz {
  id: string;
  category_id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  difficulty_level: DifficultyLevel;
  questions_per_attempt: number;
  time_limit_minutes: number;
  passing_score: number;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface Question {
  id: string;
  quiz_id: string;
  question_type: QuestionType;
  question_text: string;
  question_image_url?: string;
  points: number;
  display_order: number;
  metadata?: string;
  created_at: string;
  updated_at: string;
  options: QuestionOption[];
  quiz?: {
    id: string;
    title: string;
  };
}

export interface QuestionOption {
  id: string;
  text: string;
  image?: string;
  is_correct: boolean;
}

export interface Analytics {
  summary: {
    totalUsers: number;
    totalQuizzes: number;
    totalQuestions: number;
    completedAttempts: number;
    totalCategories: number;
    totalCertificates: number;
  };
  recentActivity: {
    recentUsers: User[];
    recentAttempts: any[];
  };
}
