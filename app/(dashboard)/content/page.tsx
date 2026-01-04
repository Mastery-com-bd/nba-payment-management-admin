"use client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/api/adminApi";
import { Analytics } from "@/lib/types";
import {
  ArrowLeft,
  File,
  FileText,
  FolderOpen,
  HelpCircle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
// import { Analytics } from "@/lib/types";

export default function ContentPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adminApi.getAnalytics();
        // console.log("Analytics response:", res);
        if (res.success) {
          setAnalytics(res?.data ?? null);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const summary = analytics?.summary;

  // console.log("ContentPage summary:", summary);

  const contentSections = [
    {
      title: "Categories",
      description: "Organize quizzes into categories",
      href: "/content/categories",
      icon: FolderOpen,
      count: summary?.totalCategories,
    },
    {
      title: "Quizzes",
      description: "Create and manage quiz content",
      href: "/content/quizzes",
      icon: FileText,
      count: summary?.totalQuizzes,
    },
    {
      title: "Questions",
      description: "Manage individual quiz questions",
      href: "/content/questions",
      icon: HelpCircle,
      count: summary?.totalQuestions,
    },
    {
      title: "Certificates",
      description: "Manage individual quiz certificates",
      href: "/content/certificates",
      icon: File,
      count: summary?.totalCertificates,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/analytics"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">
            Manage your quiz content, categories, and questions
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contentSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                  <p className="text-lg font-bold text-foreground mt-1">
                    {loading ? "..." : section.count}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button asChild className="flex-1">
                  <Link href={section.href}>Manage</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`${section.href}/create`}>
                    <Plus className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
