"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { SearchableCombobox, ComboboxOption } from "@/components/ui/searchable-combobox";
import { Combobox } from "@/components/ui/combobox";
import { adminApi } from "@/lib/api/adminApi";
import { Question, Quiz } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

const questionSchema = z.object({
  quiz_id: z.string().min(1, "Quiz is required"),
  question_type: z.enum(["multiple_choice", "checkbox", "yes_no"]),
  question_text: z.string().min(1, "Question text is required"),
  points: z.number().int().positive("Must be a positive number"),
  display_order: z.number().int().min(1, "Display order must be at least 1"),
  options: z
    .array(
      z.object({
        option_text: z.string().min(1, "Option text is required"),
        is_correct: z.boolean(),
        display_order: z.number().int().min(1),
      })
    )
    .min(2, "At least 2 options are required"),
  fun_facts: z
    .array(
      z.object({
        title: z.string().min(1, "Fun fact title is required"),
        content: z.string().min(1, "Fun fact content is required"),
      })
    )
    .optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  question?: Question;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

export function QuestionForm({
  question,
  onSubmit,
  isLoading,
}: QuestionFormProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizOptions, setQuizOptions] = useState<ComboboxOption[]>([]);
  const [quizSearchLoading, setQuizSearchLoading] = useState(false);
  const [questionImage, setQuestionImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    question?.question_image_url || null
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      quiz_id: question?.quiz_id || "",
      question_type: question?.question_type || "multiple_choice",
      question_text: question?.question_text || "",
      points: question?.points || 1,
      display_order: question?.display_order || 1,
      options: question?.options?.map((opt, index) => ({
        option_text: opt.text || "",
        is_correct: opt.is_correct || false,
        display_order: index + 1,
      })) || [
        { option_text: "", is_correct: false, display_order: 1 },
        { option_text: "", is_correct: false, display_order: 2 },
      ],
      fun_facts: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const {
    fields: funFactFields,
    append: appendFunFact,
    remove: removeFunFact,
  } = useFieldArray({
    control,
    name: "fun_facts",
  });

  const questionType = watch("question_type");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await adminApi.getAllQuizzes({ limit: 10 });
        if (response.success && response.data) {
          setQuizzes(response.data);
          setQuizOptions(
            response.data.map((quiz) => ({
              value: quiz.id,
              label: quiz.title,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
        toast.error("Failed to load quizzes");
      }
    };
    fetchQuizzes();
  }, []);

  const searchQuizzes = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      const response = await adminApi.getAllQuizzes({ limit: 10 });
      if (response.success && response.data) {
        setQuizOptions(
          response.data.map((quiz) => ({
            value: quiz.id,
            label: quiz.title,
          }))
        );
      }
      return;
    }

    setQuizSearchLoading(true);
    try {
      const response = await adminApi.getAllQuizzes({
        searchTerm,
        limit: 10,
      });
      if (response.success && response.data) {
        setQuizOptions(
          response.data.map((quiz) => ({
            value: quiz.id,
            label: quiz.title,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to search quizzes:", error);
      toast.error("Failed to search quizzes");
    } finally {
      setQuizSearchLoading(false);
    }
  };

  useEffect(() => {
    if (questionType === "yes_no") {
      setValue("options", [
        { option_text: "Yes", is_correct: false, display_order: 1 },
        { option_text: "No", is_correct: false, display_order: 2 },
      ]);
    }
  }, [questionType, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQuestionImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setQuestionImage(null);
    setImagePreview(null);
  };

  const addOption = () => {
    append({
      option_text: "",
      is_correct: false,
      display_order: fields.length + 1,
    });
  };

  const addFunFact = () => {
    appendFunFact({
      title: "",
      content: "",
    });
  };

  const handleFormSubmit = async (data: QuestionFormData) => {
    const formData = new FormData();

    // Add basic fields
    formData.append("quiz_id", data.quiz_id);
    formData.append("question_type", data.question_type);
    formData.append("question_text", data.question_text);
    formData.append("points", data.points.toString());
    formData.append("display_order", Math.max(1, data.display_order).toString());

    // Add options as JSON
    const options = data.options.map((option, index) => ({
      option_text: option.option_text,
      is_correct: option.is_correct,
      display_order: index + 1,
    }));
    formData.append("options", JSON.stringify(options));

    // Add fun facts if any exist
    if (data.fun_facts && data.fun_facts.length > 0) {
      const funFacts = data.fun_facts.filter((ff) => ff.title && ff.content);
      if (funFacts.length > 0) {
        formData.append("fun_facts", JSON.stringify(funFacts));
      }
    }

    // Add image if present
    if (questionImage) {
      formData.append("question_image", questionImage);
    }

    await onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{question ? "Edit Question" : "Create Question"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quiz_id">Quiz *</Label>
              <Controller
                name="quiz_id"
                control={control}
                render={({ field }) => (
                  <Combobox
                    options={quizOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    onSearch={searchQuizzes}
                    placeholder="Select quiz"
                    searchPlaceholder="Search quizzes..."
                    emptyText="No quizzes found."
                    loading={quizSearchLoading}
                  />
                )}
              />
              {errors.quiz_id && (
                <p className="text-destructive text-sm">
                  {errors.quiz_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="question_type">Question Type</Label>
              <Controller
                name="question_type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">
                        Multiple Choice
                      </SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                      <SelectItem value="yes_no">Yes/No</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question_text">Question Text *</Label>
            <Textarea
              id="question_text"
              {...register("question_text")}
              placeholder="Enter your question"
              rows={3}
            />
            {errors.question_text && (
              <p className="text-destructive text-sm">
                {errors.question_text.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Question Image</Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Question preview"
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                min="1"
                {...register("points", { valueAsNumber: true })}
              />
              {errors.points && (
                <p className="text-destructive text-sm">
                  {errors.points.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                min="1"
                {...register("display_order", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Answer Options *</Label>
              {questionType !== "yes_no" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-3 p-3 border rounded"
                >
                  <div className="flex-1">
                    <Input
                      {...register(`options.${index}.option_text`)}
                      placeholder={`Option ${index + 1}`}
                      disabled={questionType === "yes_no"}
                    />
                    {errors.options?.[index]?.option_text && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.options[index]?.option_text?.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Controller
                      name={`options.${index}.is_correct`}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label className="text-sm">Correct</Label>
                  </div>

                  {questionType !== "yes_no" && fields.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {errors.options && (
              <p className="text-destructive text-sm">
                {errors.options.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Fun Facts (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFunFact}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Fun Fact
              </Button>
            </div>

            {funFactFields.length > 0 && (
              <div className="space-y-3">
                {funFactFields.map((field, index) => (
                  <div key={field.id} className="p-3 border rounded space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Fun Fact {index + 1}
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFunFact(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Input
                        {...register(`fun_facts.${index}.title`)}
                        placeholder="Fun fact title"
                      />
                      <Textarea
                        {...register(`fun_facts.${index}.content`)}
                        placeholder="Fun fact content"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : question ? "Update" : "Create"}
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
