"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/api/adminApi";
import { Category } from "@/lib/types";
import { Edit, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CategoryDetailPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await adminApi.getCategoryById(id);
        if (response.success && response.data) {
          setCategory(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch category:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/content/categories">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground">Category Details</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/content/categories/${id}/edit`}>
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
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-lg">{category.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p>{category.description || "No description"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Display Order</label>
              <p>{category.display_order}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div>
                <Badge variant={category.is_active ? "success" : "destructive"}>
                  {category.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Icon</label>
              <div className="flex items-center gap-3">
                {category.icon_url ? (
                  <img src={category.icon_url} alt={category.name} className="w-8 h-8" />
                ) : (
                  <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                    {category.name.charAt(0)}
                  </div>
                )}
                <span className="text-sm text-muted-foreground">
                  {category.icon_url || "No icon"}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p>{new Date(category.created_at).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}