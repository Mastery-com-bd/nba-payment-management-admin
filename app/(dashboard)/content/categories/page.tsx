"use client";

import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { adminApi } from "@/lib/api/adminApi";
import { Category } from "@/lib/types";
import { ArrowLeft, Edit, Eye, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const router = useRouter();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchCategories = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await adminApi.getAllCategories({
        page,
        limit: pagination.limit,
        searchTerm: search || undefined,
      });
      if (response.success && response.data) {
        setCategories(response.data);
        setPagination((prev) => ({
          ...prev,
          page: response.meta?.page || 1,
          total: response.meta?.total || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handlePageChange = (page: number) => {
    fetchCategories(page);
  };

  const handleSearch = (query: string) => {
    fetchCategories(1, query);
  };

  const handleView = (id: string) => {
    router.push(`/content/categories/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/content/categories/${id}/edit`);
  };

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await adminApi.deleteCategory(categoryToDelete);
      if (response.success) {
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Failed to delete category");
    } finally {
      setCategoryToDelete(null);
    }
  };

  const columns = [
    {
      key: "icon",
      label: "Icon",
      render: (category: Category) => (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
          {category.icon_url ? (
            <img
              src={category.icon_url}
              alt={category.name}
              className="w-6 h-6"
            />
          ) : (
            <span className="text-xs font-bold">{category.name.charAt(0)}</span>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "description",
      label: "Description",
      render: (category: Category) => (
        <span className="text-sm text-muted-foreground">
          {category.description || "No description"}
        </span>
      ),
    },
    {
      key: "display_order",
      label: "Order",
    },
    {
      key: "is_active",
      label: "Status",
      render: (category: Category) => (
        <Badge variant={category.is_active ? "success" : "destructive"}>
          {category.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (category: Category) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(category.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(category.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteClick(category.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/content"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-muted-foreground">Manage quiz categories</p>
          </div>
        </div>

        <Link href="/content/categories/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      <DataTable
        data={categories}
        columns={columns}
        searchKey="categories"
        pagination={{
          ...pagination,
          onPageChange: handlePageChange,
        }}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category and may affect associated quizzes and questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
