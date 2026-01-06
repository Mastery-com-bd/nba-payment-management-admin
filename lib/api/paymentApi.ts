import { TPaymentStatus } from "@/types/payment.types";
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

export const paymentApi = {
  // ==================== Public Quiz Routes ====================

  async getAllPayment(params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    paymentType?: string;
  }): Promise<any> {
    console.log(params?.paymentStatus);
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
    if (params?.paymentStatus) {
      searchParams.append("paymentStatus", params.paymentStatus);
    }
    if (params?.paymentMethod) {
      searchParams.append("paymentMethod", params.paymentMethod);
    }
    if (params?.paymentType) {
      searchParams.append("paymentType", params.paymentType);
    }
    const query = searchParams.toString();
    console.log(query);
    return publicFetch(`${API_BASE_URL}/payment/${query ? `?${query}` : ""}`, {
      method: "GET",
      credentials: "include",
    });
  },

  async getASinglePayment(id: string): Promise<any> {
    return publicFetch(`${API_BASE_URL}/payment/${id}`, {
      method: "GET",
      credentials: "include",
    });
  },

  async deletePayment(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/payment/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    return response.json();
  },

  async updatePayment(id: string, data: FormData): Promise<any> {
    try {
      const res = await authFetch(`${API_BASE_URL}/payment/${id}`, {
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

  async createPayment(data: FormData): Promise<any> {
    try {
      const res = await authFetch(`${API_BASE_URL}/payment`, {
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

  async updatePaymentStatus(
    data: { paymentStatus: TPaymentStatus },
    id: string,
  ): Promise<any> {
    try {
      const res = await authFetch(`${API_BASE_URL}/payment/${id}/status`, {
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

};
