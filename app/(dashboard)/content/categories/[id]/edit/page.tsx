"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CategoryForm } from "@/components/forms/CategoryForm";
import { adminApi } from "@/lib/api/adminApi";
import { Category } from "@/lib/types";

export default function EditCategoryPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await adminApi.getCategoryById(id);
        if (response.success && response.data) {
          setCategory(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch category:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await adminApi.updateCategory(id, data);
      if (response.success) {
        router.push(`/content/categories/${id}`);
      }
    } catch (error) {
      console.error("Failed to update category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Category</h1>
        <p className="text-muted-foreground">Update category information</p>
      </div>
      <CategoryForm 
        category={category} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
}