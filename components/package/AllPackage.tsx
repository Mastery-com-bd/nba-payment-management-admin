'use client';
import { packageApi } from "@/lib/api/pacakge";
import { TPackage } from "@/lib/types/pacakge.types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AllPackage() {
   const [packages, setPackages] = useState<TPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [packageToDelete, setPackageToDelete] = useState<string | null>(null);
    const router = useRouter();
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
      });
    const fetchPackages = async (page = 1, search = "") => {
          setLoading(true);
          try {
            const response = await packageApi.getAllPacakges({
              page,
              limit: pagination.limit,
              searchTerm: search || undefined,
            });
            if (response?.success) {
              setPackages(response?.data)
              setPagination((prev) => ({
                ...prev,
                page: response.meta?.page || 1,
                total: response.meta?.total || 0,
              }));
            }
          } catch (error) {
            console.error("Failed to fetch quizzes:", error);
          } finally {
            setLoading(false);
          }
        };
    useEffect(() => {
          fetchPackages();
        }, []);

        const handlePageChange = (page: number) => {
    fetchPackages(page);
  };

  const handleSearch = (query: string) => {
    fetchPackages(1, query);
  };

  const handleView = (id: string) => {
    router.push(`/content/quizzes/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/content/quizzes/${id}/edit`);
  };

  const handleDeleteClick = (id: string) => {
    setPackageToDelete(id);
  };
  return (
    <div>
    AllPackage
  </div>
  )
}