"use client";

import { authApi } from "@/lib/api/authApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    setError("");
    
    try {
      const result = await authApi.forgotPassword({ email: data.email });
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || "Failed to send reset email");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
    
    setIsLoading(false);
  };

  if (success) {
    return (
      <Card className="card-glow w-full max-w-md text-center">
        <CardContent className="pt-6">
          <div className="text-primary mb-4">
            <Mail className="w-16 h-16 mx-auto" />
          </div>
          <CardTitle className="text-xl mb-2">Email Sent!</CardTitle>
          <CardDescription className="mb-4">
            We've sent a password reset link to your email address.
          </CardDescription>
          <Button asChild variant="outline">
            <Link href="/login">Back to login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-glow w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl gradient-text">Forgot Password</CardTitle>
        <CardDescription>Enter your email to reset your password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              {...register("email")}
              type="email"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>

          <div className="text-center">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Back to login</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}