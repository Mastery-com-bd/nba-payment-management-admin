"use client";

import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { questionApi } from "@/lib/api/questionApi";
import { Question } from "@/lib/types";
import { ArrowLeft, Edit, Eye, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchQuestions = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await questionApi.getAllQuestions({
        page,
        limit: pagination.limit,
      });
      if (response.success && response.data) {
        setQuestions(response?.data);
        setPagination((prev) => ({
          ...prev,
          page: response.meta?.page || 1,
          total: response.meta?.total || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handlePageChange = (page: number) => {
    fetchQuestions(page);
  };

  const handleSearch = (query: string) => {
    fetchQuestions(1, query);
  };

  const handleView = (id: string) => {
    router.push(`/content/questions/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/content/questions/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this question? This action cannot be undone."
      )
    ) {
      try {
        const response = await questionApi.deleteQuestion(id);
        if (response.success) {
          toast.success("Question deleted successfully!");
          fetchQuestions();
        } else {
          toast.error(response.message || "Failed to delete question");
        }
      } catch (error) {
        console.error("Failed to delete question:", error);
        toast.error("Failed to delete question");
      }
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "multiple_choice":
        return "default";
      case "checkbox":
        return "secondary";
      case "yes_no":
        return "outline";
      default:
        return "secondary";
    }
  };

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (question: Question) => (
        <div className="w-12 h-8 rounded overflow-hidden bg-muted">
          {question.question_image_url ? (
            <img
              src={question.question_image_url}
              alt="Question"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs">
              Q
            </div>
          )}
        </div>
      ),
    },
    {
      key: "question_text",
      label: "Question",
      render: (question: Question) => (
        <div className="max-w-xs truncate" title={question.question_text}>
          {question.question_text}
        </div>
      ),
    },
    {
      key: "quiz",
      label: "Quiz",
      render: (question: Question) => question.quiz?.title || "No Quiz",
    },
    {
      key: "question_type",
      label: "Type",
      render: (question: Question) => (
        <Badge variant={getQuestionTypeColor(question.question_type) as any}>
          {question.question_type.replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: "points",
      label: "Points",
    },
    {
      key: "display_order",
      label: "Order",
    },
    {
      key: "actions",
      label: "Actions",
      render: (question: Question) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(question.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(question.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(question.id)}
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
            <h1 className="text-3xl font-bold">Questions</h1>
            <p className="text-muted-foreground">
              Manage quiz questions and answers
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/content/questions/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Link>
        </Button>
      </div>

      <DataTable
        data={questions}
        columns={columns}
        searchKey="questions"
        pagination={{
          ...pagination,
          onPageChange: handlePageChange,
        }}
        onSearch={handleSearch}
        loading={loading}
      />
    </div>
  );
}
