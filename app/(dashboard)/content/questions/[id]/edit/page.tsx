"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuestionForm } from "@/components/forms/QuestionForm";
import { Skeleton } from "@/components/ui/skeleton";
import { questionApi } from "@/lib/api/questionApi";
import { Question } from "@/lib/types";
import { toast } from "sonner";

export default function EditQuestionPage() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await questionApi.getQuestionById(id);
        if (response.success && response.data) {
          setQuestion(response.data);
        } else {
          toast.error("Failed to fetch question");
        }
      } catch (error) {
        console.error("Failed to fetch question:", error);
        toast.error("Failed to fetch question");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuestion();
    }
  }, [id]);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const response = await questionApi.updateQuestion(id, formData);
      if (response.success) {
        toast.success("Question updated successfully!");
        router.push(`/content/questions/${id}`);
      } else {
        toast.error(response.message || "Failed to update question");
      }
    } catch (error) {
      console.error("Failed to update question:", error);
      toast.error("Failed to update question");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!question) {
    return <div>Question not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Question</h1>
        <p className="text-muted-foreground">Update question information</p>
      </div>
      <QuestionForm 
        question={question} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
}