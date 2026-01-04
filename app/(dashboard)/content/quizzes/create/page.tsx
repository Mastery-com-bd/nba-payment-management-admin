"use client";

import { QuizForm } from "@/components/forms/QuizForm";
import { adminApi } from "@/lib/api/adminApi";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateQuizPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const response = await adminApi.createQuiz(formData);
      if (response.success) {
        router.push("/content/quizzes");
      }
    } catch (error) {
      console.error("Failed to create quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/content/quizzes"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Quiz</h1>
          <p className="text-muted-foreground">
            Add a new quiz to your collection
          </p>
        </div>
      </div>
      <QuizForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
