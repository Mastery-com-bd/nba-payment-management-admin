import { create } from "domain";
import { get } from "http";
import { getEdgePolyfilledModules } from "next/dist/build/webpack/plugins/middleware-plugin";
import { toast } from "sonner";
import { success } from "zod";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// Helper function for authenticated requests
const studentPackageFetch = async (url: string, options: RequestInit = {}) => {
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

// ==================== package Routes ====================
export const studnetPackageApi = {
  async getAllStudentPackages(params?: {
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
    return publicFetch(`${API_BASE_URL}/student-package/${query ? `?${query}` : ""}`, {
      method: "GET",
      credentials: "include",
    });
  },
  async getStudentPackageById(id: string): Promise<any> {
    return publicFetch(`${API_BASE_URL}/student-package/${id}`, {
      method: "GET",
      credentials: "include",
    });
  },
  async createStudentPackage(data: any) {
    try {
      const res = await studentPackageFetch(`${API_BASE_URL}/student-package/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // authFetch jodi response object return kore (success/error field shoho)
      return res;
    } catch (error: any) {
      console.error("API Error in createPackage:", error);
      // Network fail hole ba onno error hole ekta consistent format return kora bhalo
      return {
        success: false,
        message: error?.message || "Internal Server Error",
      };
    }
  },
  async updatePackage(id: string, data: any) {
    try {
      const res = await studentPackageFetch(`${API_BASE_URL}/package/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      return res;
    } catch (error: any) {
      console.error("API Error in updatePackage:", error);
      return {
        success: false,
        message: error?.message || "Internal Server Error",
      };
    }
  },
 async deletePackage(id: string) {
  try {
    const res = await studentPackageFetch(`${API_BASE_URL}/package/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return res;
  } catch (error: any) {
    console.error("API Error in deletePackage:", error);
    return {
      success: false,
      message: error?.message || "Internal Server Error",
    };
  }
 }
};
