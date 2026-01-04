"use client";

import { CategoryForm } from "@/components/forms/CategoryForm";
import { adminApi } from "@/lib/api/adminApi";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateCategoryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await adminApi.createCategory(data);
      if (response.success) {
        toast.success("Category created successfully");
        router.push("/content/categories");
      } else {
        toast.error("Failed to create category");
      }
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error("Failed to create category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/content/categories"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Category</h1>
          <p className="text-muted-foreground">Add a new quiz category</p>
        </div>
      </div>
      <CategoryForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
