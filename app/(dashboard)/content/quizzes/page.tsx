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
import { Quiz } from "@/lib/types";
import { ArrowLeft, Edit, Eye, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const router = useRouter();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchQuizzes = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await adminApi.getAllQuizzes({
        page,
        limit: pagination.limit,
        searchTerm: search || undefined,
      });
      if (response.success && response.data) {
        setQuizzes(response.data);
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
    fetchQuizzes();
  }, []);

  const handlePageChange = (page: number) => {
    fetchQuizzes(page);
  };

  const handleSearch = (query: string) => {
    fetchQuizzes(1, query);
  };

  const handleView = (id: string) => {
    router.push(`/content/quizzes/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/content/quizzes/${id}/edit`);
  };

  const handleDeleteClick = (id: string) => {
    setQuizToDelete(id);
  };

  const confirmDelete = async () => {
    if (!quizToDelete) return;

    try {
      const response = await adminApi.deleteQuiz(quizToDelete);
      if (response.success) {
        toast.success("Quiz deleted successfully");
        fetchQuizzes();
      } else {
        toast.error("Failed to delete quiz");
      }
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      toast.error("Failed to delete quiz");
    } finally {
      setQuizToDelete(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const columns = [
    {
      key: "thumbnail",
      label: "Thumbnail",
      render: (quiz: Quiz) => (
        <div className="w-12 h-8 rounded overflow-hidden bg-muted">
          {quiz.thumbnail_url ? (
            <img
              src={quiz.thumbnail_url}
              alt={quiz.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs">
              {quiz.title.charAt(0)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
    },
    {
      key: "category",
      label: "Category",
      render: (quiz: Quiz) => quiz.category?.name || "No Category",
    },
    {
      key: "difficulty_level",
      label: "Difficulty",
      render: (quiz: Quiz) => (
        <Badge variant={getDifficultyColor(quiz.difficulty_level) as any}>
          {quiz.difficulty_level}
        </Badge>
      ),
    },
    {
      key: "questions_per_attempt",
      label: "Questions",
    },
    {
      key: "time_limit_minutes",
      label: "Time (min)",
    },
    {
      key: "passing_score",
      label: "Pass %",
    },
    {
      key: "is_published",
      label: "Status",
      render: (quiz: Quiz) => (
        <Badge variant={quiz.is_published ? "success" : "secondary"}>
          {quiz.is_published ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (quiz: Quiz) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(quiz.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(quiz.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteClick(quiz.id)}
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
            <h1 className="text-3xl font-bold">Quizzes</h1>
            <p className="text-muted-foreground">
              Manage quiz content and settings
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/content/quizzes/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Quiz
          </Link>
        </Button>
      </div>

      <DataTable
        data={quizzes}
        columns={columns}
        searchKey="quizzes"
        pagination={{
          ...pagination,
          onPageChange: handlePageChange,
        }}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!quizToDelete}
        onOpenChange={(open) => !open && setQuizToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              quiz and all associated questions and data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setQuizToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
