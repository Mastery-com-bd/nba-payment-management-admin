"use client";

import type React from "react";

// import { GlowCard } from "@/components/glow-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
// import { interestOptions } from "@/lib/mock-data";
import { ArrowLeft, Upload, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    phone_number: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        address: user.address || "",
        phone_number: user.phone_number || "",
        bio: user.bio || "",
      });
      setImagePreview(user.avatar_url || null);
    } else {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("full_name", formData.full_name);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("phone_number", formData.phone_number);
      formDataToSend.append("bio", formData.bio);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formDataToSend.append("avatar_url", fileInput.files[0]);
      }

      const { userApi } = await import("@/lib/api/userApi");
      const response = await userApi.updateUserProfile(formDataToSend);

      if (response.success) {
        const { authApi } = await import("@/lib/api/authApi");
        const userResponse = await authApi.getMe();
        if (userResponse.success && userResponse.data) {
          updateUser(userResponse.data);
        }
        toast.success("Profile updated successfully!");
        router.push("/profile");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Edit <span className="gradient-text">Profile</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Update your profile information and interests
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <Label className="text-base font-semibold">Profile Photo</Label>
          <div className="mt-4 flex items-center gap-6">
            <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-muted">
              {imagePreview ? (
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Profile preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="cursor-pointer">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 bg-transparent"
                  asChild
                >
                  <span>
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>

          {/* Basic Info */}

          <Label className="text-base font-semibold">Basic Information</Label>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="full_name"
                  placeholder="Your full name"
                  className="pl-10"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="address"
                  placeholder="Your address"
                  className="pl-10"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone_number"
                  placeholder="Your phone number"
                  className="pl-10"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="bio"
                  placeholder="Your bio"
                  className="pl-10"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
