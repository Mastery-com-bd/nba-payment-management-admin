"use client";

import { QuestionForm } from "@/components/forms/QuestionForm";
import { questionApi } from "@/lib/api/questionApi";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateQuestionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const response = await questionApi.createQuestion(formData);
      if (response.success) {
        toast.success("Question created successfully!");
        router.push("/content/questions");
      } else {
        toast.error(response.message || "Failed to create question");
      }
    } catch (error) {
      console.error("Failed to create question:", error);
      toast.error("Failed to create question");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/content/questions"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Question</h1>
          <p className="text-muted-foreground">
            Add a new question to your quiz
          </p>
        </div>
      </div>
      <QuestionForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
