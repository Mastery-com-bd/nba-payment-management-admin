import { TStudentStatus, TWhatsappStatus } from "@/types/student.types";

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

export const studentApi = {
  // ==================== Public Quiz Routes ====================

  async getAllStudents(params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) {
      searchParams.append("page", params.page.toString());
    }

    if (params?.limit !== undefined) {
      searchParams.append("limit", params.limit.toString());
    }

    if (params?.searchTerm) {
      searchParams.append("searchTerm", params.searchTerm);
    }
    const query = searchParams.toString();
    return publicFetch(`${API_BASE_URL}/student/${query ? `?${query}` : ""}`, {
      method: "GET",
      credentials: "include",
    });
  },

  async getASingleStudent(id: string): Promise<any> {
    return publicFetch(`${API_BASE_URL}/student/${id}`, {
      method: "GET",
      credentials: "include",
    });
  },

  async deleteStudent(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/student/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    return response.json();
  },

  async updateStudent(id: string, data: FormData): Promise<any> {
    try {
      const res = await authFetch(`${API_BASE_URL}/student/${id}`, {
        method: "PATCH",
        body: data, // let fetch handle Content-Type
        credentials: "include",
      });

      // authFetch already returns parsed JSON, so no res.json()
      // Just return it
      return res;
    } catch (err) {
      console.error("Error creating student:", err);
      throw err;
    }
  },

  async createStudent(data: FormData): Promise<any> {
    try {
      const res = await authFetch(`${API_BASE_URL}/student`, {
        method: "POST",
        body: data, // let fetch handle Content-Type
        credentials: "include",
      });

      // authFetch already returns parsed JSON, so no res.json()
      // Just return it
      return res;
    } catch (err) {
      console.error("Error creating student:", err);
      throw err;
    }
  },
  async updateStatus(
    data: { studentStatus: TStudentStatus },
    id: string,
  ): Promise<any> {
    try {
      const res = await authFetch(`${API_BASE_URL}/student/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // let fetch handle Content-Type
        credentials: "include",
      });
      return res;
    } catch (err) {
      console.error("Error creating student:", err);
      throw err;
    }
  },

  async updateWhatsAppStatus(
    data: { whatsappStatus: TWhatsappStatus },
    id: string,
  ): Promise<any> {
    try {
      const res = await authFetch(
        `${API_BASE_URL}/student/${id}/whatsapp-status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data), // let fetch handle Content-Type
          credentials: "include",
        },
      );
      return res;
    } catch (err) {
      console.error("Error creating student:", err);
      throw err;
    }
  },

  async deleteStatus(data: FormData): Promise<any> {
    try {
      const res = await authFetch(`${API_BASE_URL}/student`, {
        method: "POST",
        body: data, // let fetch handle Content-Type
        credentials: "include",
      });

      // authFetch already returns parsed JSON, so no res.json()
      // Just return it
      return res;
    } catch (err) {
      console.error("Error creating student:", err);
      throw err;
    }
  },
};
