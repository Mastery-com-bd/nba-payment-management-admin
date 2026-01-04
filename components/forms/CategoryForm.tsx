"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Category } from "@/lib/types";
import { useState } from "react";
import { X, Upload } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters long"),
  description: z.string().optional(),
  icon_url: z.string().optional(),
  display_order: z.number().int().min(0, "Display order must be 0 or greater"),
  is_active: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function CategoryForm({ category, onSubmit, isLoading }: CategoryFormProps) {
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(category?.icon_url || null);
  const [useUrlInput, setUseUrlInput] = useState(!category?.icon_url || category?.icon_url?.startsWith('http'));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      icon_url: category?.icon_url || "",
      display_order: category?.display_order || 0,
      is_active: category?.is_active ?? true,
    },
  });

  const isActive = watch("is_active");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onload = () => setIconPreview(reader.result as string);
      reader.readAsDataURL(file);
      setValue("icon_url", ""); // Clear URL when file is selected
    }
  };

  const removeIcon = () => {
    setIconFile(null);
    setIconPreview(null);
    setValue("icon_url", "");
  };

  const handleFormSubmit = async (data: CategoryFormData) => {
    const payload: any = {
      name: data.name,
      display_order: data.display_order,
      is_active: data.is_active,
    };
    
    if (data.description) payload.description = data.description;
    if (data.icon_url && !iconFile) payload.icon_url = data.icon_url;
    
    // For now, we'll handle file upload separately if needed
    // The backend validation expects JSON, not FormData
    
    await onSubmit(payload);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category ? "Edit Category" : "Create Category"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter category name"
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter category description"
              rows={3}
            />
            {errors.description && (
              <p className="text-destructive text-sm">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <Label>Category Icon (Optional)</Label>
            
            <div className="flex gap-4 mb-4">
              <Button
                type="button"
                variant={useUrlInput ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setUseUrlInput(true);
                  setIconFile(null);
                  setIconPreview(null);
                }}
              >
                Icon URL
              </Button>
              <Button
                type="button"
                variant={!useUrlInput ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setUseUrlInput(false);
                  setValue("icon_url", "");
                }}
              >
                Upload Image
              </Button>
            </div>

            {useUrlInput ? (
              <div className="space-y-2">
                <Input
                  {...register("icon_url")}
                  placeholder="https://example.com/icon.png"
                  onChange={(e) => {
                    setValue("icon_url", e.target.value);
                    if (e.target.value) {
                      setIconPreview(e.target.value);
                      setIconFile(null);
                    }
                  }}
                />
                {errors.icon_url && (
                  <p className="text-destructive text-sm">{errors.icon_url.message}</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.querySelector('input[type="file"]')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>
            )}

            {iconPreview && (
              <div className="relative inline-block">
                <img
                  src={iconPreview}
                  alt="Icon preview"
                  className="w-16 h-16 object-cover rounded border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0"
                  onClick={removeIcon}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              {...register("display_order", { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.display_order && (
              <p className="text-destructive text-sm">{errors.display_order.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={isActive}
              onCheckedChange={(checked) => setValue("is_active", !!checked)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : category ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}