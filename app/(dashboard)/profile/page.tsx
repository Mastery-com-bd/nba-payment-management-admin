"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Mail,
  MapPin,
  Phone,
  Shield,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();

  if (!currentUser) {
    router.push("/login");
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/analytics"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account information
            </p>
          </div>
        </div>
        <Link href="/profile/edit">
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={currentUser.avatar_url || "/placeholder.svg"}
                  alt={currentUser.full_name}
                />
                <AvatarFallback className="text-2xl">
                  {currentUser.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{currentUser.full_name}</CardTitle>
            <Badge
              variant={currentUser.role === "admin" ? "default" : "secondary"}
              className="w-fit mx-auto"
            >
              <Shield className="h-3 w-3 mr-1" />
              {currentUser.role}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Member since</p>
                  <p className="text-muted-foreground">
                    {new Date(currentUser.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 flex items-center justify-center">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      currentUser.is_active ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Status</p>
                  <p className="text-muted-foreground">
                    {currentUser.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Email Address</p>
                    <p className="text-muted-foreground">{currentUser.email}</p>
                  </div>
                </div>

                {currentUser.phone_number && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Phone Number</p>
                      <p className="text-muted-foreground">
                        {currentUser.phone_number}
                      </p>
                    </div>
                  </div>
                )}

                {currentUser.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Address</p>
                      <p className="text-muted-foreground">
                        {currentUser.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {currentUser.bio && (
                  <div>
                    <p className="font-medium text-sm mb-2">Bio</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {currentUser.bio}
                    </p>
                  </div>
                )}

                <div>
                  <p className="font-medium text-sm mb-2">Account Details</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="font-mono text-xs">
                        {currentUser.id.slice(0, 8)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Last Updated:
                      </span>
                      <span>
                        {new Date(currentUser.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Link href="/profile/edit">
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
