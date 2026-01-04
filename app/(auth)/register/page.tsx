"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  full_name: z.string().min(2, "Full name must be at least 2 characters long"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError("");
    
    const result = await registerUser({
      email: data.email,
      password: data.password,
      fullName: data.full_name,
      role: "admin",
    });
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setError(result.error || "Registration failed");
    }
    
    setIsLoading(false);
  };

  if (success) {
    return (
      <Card className="card-glow w-full max-w-md text-center">
        <CardContent className="pt-6">
          <div className="text-primary mb-4">
            <CheckCircle className="w-16 h-16 mx-auto" />
          </div>
          <CardTitle className="text-xl mb-2">Registration Successful!</CardTitle>
          <CardDescription>Redirecting to login page...</CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-glow w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl gradient-text">Create Account</CardTitle>
        <CardDescription>Join the admin dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              {...register("full_name")}
              type="text"
              placeholder="Enter your full name"
            />
            {errors.full_name && (
              <p className="text-destructive text-sm">{errors.full_name.message}</p>
            )}
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              {...register("password")}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-destructive text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>

          <div className="text-center">
            <div className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80">
                Sign in
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}