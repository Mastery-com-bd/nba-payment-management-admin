"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authApi } from "@/lib/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Globe, Lock, Palette, Save } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });
  // const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const handlePasswordChange = async (data: PasswordFormData) => {
    try {
      const response = await authApi.changePassword(data);
      if (response.success) {
        toast.success("Password changed successfully");
        reset();
        // setIsChangingPassword(false);
      } else {
        toast.error(response.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully");
  };

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
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and platform preferences
          </p>
        </div>
      </div>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>Manage your security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* {!isChangingPassword ? (
            <Button
              variant="outline"
              onClick={() => setIsChangingPassword(true)}
              className="w-full justify-start"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          ) : ( */}
          <form
            onSubmit={handleSubmit(handlePasswordChange)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <PasswordInput
                id="currentPassword"
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <p className="text-destructive text-sm">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <PasswordInput id="newPassword" {...register("newPassword")} />
              {errors.newPassword && (
                <p className="text-destructive text-sm">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordInput
                id="confirmPassword"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Changing..." : "Change Password"}
              </Button>
              {/* <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsChangingPassword(false);
                  reset();
                }}
              >
                Cancel
              </Button> */}
            </div>
          </form>
          {/* )} */}
        </CardContent>
      </Card>

      {/* Notifications */}
      {/* <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive updates via email
              </p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, email: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive browser push notifications
              </p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, push: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive updates via SMS
              </p>
            </div>
            <Switch
              checked={notifications.sms}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, sms: checked })
              }
            />
          </div>
        </CardContent>
      </Card> */}

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <CardTitle>Language & Region</CardTitle>
          </div>
          <CardDescription>Set your preferred language</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Language</Label>
            <Select value="en" disabled>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
