"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuizForm } from "@/components/forms/QuizForm";
import { adminApi } from "@/lib/api/adminApi";
import { Quiz } from "@/lib/types";

export default function EditQuizPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await adminApi.getQuizById(id);
        if (response.success && response.data) {
          setQuiz(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const response = await adminApi.updateQuiz(id, formData);
      if (response.success) {
        router.push(`/content/quizzes/${id}`);
      }
    } catch (error) {
      console.error("Failed to update quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Quiz</h1>
        <p className="text-muted-foreground">Update quiz information</p>
      </div>
      <QuizForm 
        quiz={quiz} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
}