"use client"

import { studentApi } from "@/lib/api/studentApi";
import { TStudent } from "@/lib/types/student.types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Edit, Eye, Plus, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { DataTable } from "../shared/DataTable";
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
import { toast } from "sonner";

const Students = () => {
  const [students, setStudents] = useState<TStudent[]>([]);
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
        const response = await studentApi.getAllStudents({
          page,
          limit: pagination.limit,
          searchTerm: search || undefined,
        });
        if (response?.success) {
          setStudents(response?.data)
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
      render: (studentData: TStudent) => (
        <div className="w-12 h-8 rounded overflow-hidden bg-muted">
          {studentData?.studentImage ? (
            <img
              src={studentData?.studentImage}
              alt={studentData.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs">
              {studentData?.fullName.charAt(0)}
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
      render: (student: TStudent) => student.whatsappStatus ,
    },
    {
      key: "difficulty_level",
      label: "Difficulty",
      render: (student: TStudent) => (
        <Badge variant={getDifficultyColor(student.contactNumber) as any}>
          {student.contactNumber}
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
      render: (student: TStudent) => (
        <Badge variant="success">{student.studentStatus}</Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (student: TStudent) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(student?.id)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(student?.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteClick(student?.id)}>
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
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
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
           Create Student
          </Link>
        </Button>
      </div>

      <DataTable
        data={students}
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
        onOpenChange={(open) => !open && setQuizToDelete(null)}>
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Students;