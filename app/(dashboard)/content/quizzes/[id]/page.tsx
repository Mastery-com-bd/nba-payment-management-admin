"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/api/adminApi";
import { Quiz } from "@/lib/types";
import { Edit, ArrowLeft, Clock, Users, Target, BookOpen } from "lucide-react";
import Link from "next/link";

export default function QuizDetailPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "success";
      case "medium": return "warning";
      case "hard": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/content/quizzes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{quiz.title}</h1>
            <p className="text-muted-foreground">Quiz Details</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/content/quizzes/${id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Title</label>
              <p className="text-lg">{quiz.title}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p>{quiz.description || "No description"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <p>{quiz.category?.name || "No category"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div>
                <Badge variant={quiz.is_published ? "success" : "secondary"}>
                  {quiz.is_published ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Difficulty</p>
                  <Badge variant={getDifficultyColor(quiz.difficulty_level) as any}>
                    {quiz.difficulty_level}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="font-medium">{quiz.questions_per_attempt}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Time Limit</p>
                  <p className="font-medium">{quiz.time_limit_minutes} min</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Passing Score</p>
                  <p className="font-medium">{quiz.passing_score}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thumbnail</CardTitle>
          </CardHeader>
          <CardContent>
            {quiz.thumbnail_url ? (
              <img
                src={quiz.thumbnail_url}
                alt={quiz.title}
                className="w-full h-48 object-cover rounded border"
              />
            ) : (
              <div className="w-full h-48 bg-muted rounded border flex items-center justify-center">
                <p className="text-muted-foreground">No thumbnail</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p>{new Date(quiz.created_at).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated At</label>
              <p>{new Date(quiz.updated_at).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}