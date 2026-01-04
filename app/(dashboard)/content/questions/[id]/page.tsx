"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { questionApi } from "@/lib/api/questionApi";
import { Question } from "@/lib/types";
import { Edit, ArrowLeft, HelpCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function QuestionDetailPage() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await questionApi.getQuestionById(id);
        if (response.success && response.data) {
          setQuestion(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch question:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuestion();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-20" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!question) {
    return <div>Question not found</div>;
  }

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "multiple_choice": return "default";
      case "checkbox": return "secondary";
      case "yes_no": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/content/questions">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Question Details</h1>
            <p className="text-muted-foreground">View question information</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/content/questions/${id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Question Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Question Text</label>
              <p className="text-lg">{question.question_text}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Quiz</label>
              <p>{question.quiz?.title || "No quiz assigned"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <div>
                  <Badge variant={getQuestionTypeColor(question.question_type) as any}>
                    {question.question_type.replace("_", " ")}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Points</label>
                <p className="font-medium">{question.points}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Display Order</label>
              <p>{question.display_order}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question Image</CardTitle>
          </CardHeader>
          <CardContent>
            {question.question_image_url ? (
              <img
                src={question.question_image_url}
                alt="Question"
                className="w-full h-48 object-cover rounded border"
              />
            ) : (
              <div className="w-full h-48 bg-muted rounded border flex items-center justify-center">
                <p className="text-muted-foreground">No image</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Answer Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {question.options?.map((option, index) => (
                <div
                  key={option.id || index}
                  className={`p-3 rounded border ${
                    option.is_correct ? "border-green-500 bg-green-50" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Option {index + 1}</span>
                    {option.is_correct && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <p className="mt-1">{option.text}</p>
                </div>
              )) || (
                <p className="text-muted-foreground col-span-2">No options available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p>{new Date(question.created_at).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated At</label>
              <p>{new Date(question.updated_at).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}