"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { adminApi } from "@/lib/api/adminApi";
import { Category, Quiz } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const quizSchema = z.object({
  category_id: z.string().min(1, "Category is required"),
  title: z.string().min(2, "Quiz title must be at least 2 characters long"),
  description: z.string().optional(),
  difficulty_level: z.enum(["easy", "medium", "hard"]),
  questions_per_attempt: z.number().int().positive("Must be a positive number"),
  time_limit_minutes: z.number().int().min(0, "Must be 0 or greater"),
  passing_score: z.number().int().min(0).max(100, "Must be between 0 and 100"),
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});

type QuizFormData = z.infer<typeof quizSchema>;

interface QuizFormProps {
  quiz?: Quiz;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

export function QuizForm({ quiz, onSubmit, isLoading }: QuizFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<ComboboxOption[]>([]);
  const [categorySearchLoading, setCategorySearchLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    quiz?.thumbnail_url || null
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      category_id: quiz?.category_id || "",
      title: quiz?.title || "",
      description: quiz?.description || "",
      difficulty_level: quiz?.difficulty_level || "easy",
      questions_per_attempt: quiz?.questions_per_attempt || 10,
      time_limit_minutes: quiz?.time_limit_minutes || 30,
      passing_score: quiz?.passing_score || 70,
      is_published: quiz?.is_published ?? false,
      is_featured: quiz?.is_featured ?? false,
    },
  });

  const isPublished = watch("is_published");
  const isFeatured = watch("is_featured");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await adminApi.getAllCategories({ limit: 10 });
        if (response.success && response.data) {
          setCategories(response.data);
          setCategoryOptions(
            response.data.map((category) => ({
              value: category.id,
              label: category.name,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const searchCategories = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      // Reset to initial categories when search is empty
      const response = await adminApi.getAllCategories({ limit: 10 });
      if (response.success && response.data) {
        setCategoryOptions(
          response.data.map((category) => ({
            value: category.id,
            label: category.name,
          }))
        );
      }
      return;
    }

    setCategorySearchLoading(true);
    try {
      const response = await adminApi.getAllCategories({
        searchTerm,
        limit: 10,
      });
      if (response.success && response.data) {
        setCategoryOptions(
          response.data.map((category) => ({
            value: category.id,
            label: category.name,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to search categories:", error);
      toast.error("Failed to search categories");
    } finally {
      setCategorySearchLoading(false);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  const handleFormSubmit = async (data: QuizFormData) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      await onSubmit(formData);
      toast.success(
        quiz ? "Quiz updated successfully!" : "Quiz created successfully!"
      );
    } catch (error) {
      toast.error(quiz ? "Failed to update quiz" : "Failed to create quiz");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz ? "Edit Quiz" : "Create Quiz"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter quiz title"
              />
              {errors.title && (
                <p className="text-destructive text-sm">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Category *</Label>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <Combobox
                    options={categoryOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    onSearch={searchCategories}
                    placeholder="Select category"
                    searchPlaceholder="Search categories..."
                    emptyText="No categories found."
                    loading={categorySearchLoading}
                  />
                )}
              />
              {errors.category_id && (
                <p className="text-destructive text-sm">
                  {errors.category_id.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter quiz description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Thumbnail Image</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="cursor-pointer"
                />
              </div>
              {thumbnailPreview && (
                <div className="relative">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    onClick={removeThumbnail}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="difficulty_level">Difficulty</Label>
              <Controller
                name="difficulty_level"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="questions_per_attempt">
                Questions per Attempt
              </Label>
              <Input
                id="questions_per_attempt"
                type="number"
                {...register("questions_per_attempt", { valueAsNumber: true })}
              />
              {errors.questions_per_attempt && (
                <p className="text-destructive text-sm">
                  {errors.questions_per_attempt.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time_limit_minutes">Time Limit (minutes)</Label>
              <Input
                id="time_limit_minutes"
                type="number"
                {...register("time_limit_minutes", { valueAsNumber: true })}
              />
              {errors.time_limit_minutes && (
                <p className="text-destructive text-sm">
                  {errors.time_limit_minutes.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passing_score">Passing Score (%)</Label>
            <Input
              id="passing_score"
              type="number"
              min="0"
              max="100"
              {...register("passing_score", { valueAsNumber: true })}
            />
            {errors.passing_score && (
              <p className="text-destructive text-sm">
                {errors.passing_score.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_published"
              checked={isPublished}
              onCheckedChange={(checked) => setValue("is_published", !!checked)}
            />
            <Label htmlFor="is_published">Published</Label>
            <Checkbox
              id="is_featured"
              checked={isFeatured}
              onCheckedChange={(checked) => setValue("is_featured", !!checked)}
            />
            <Label htmlFor="is_featured">Featured</Label>
          </div>
          <div className="flex items-center space-x-2"></div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : quiz ? "Update" : "Create"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
