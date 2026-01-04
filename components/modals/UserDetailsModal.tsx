"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { adminApi } from "@/lib/api/adminApi";
import { User } from "@/lib/types";
import { Calendar, Mail, MapPin, Phone, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UserDetailsModalProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsModal({
  userId,
  open,
  onOpenChange,
}: UserDetailsModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId && open) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const response = await adminApi.getUserById(userId);
          if (response.success && response.data) {
            setUser(response.data);
          }
        } catch (error) {
          toast.error("Failed to fetch user details");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [userId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        ) : user ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar_url} alt={user.full_name} />
                <AvatarFallback className="text-lg">
                  {user.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{user.full_name}</h3>
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{user.email}</span>
              </div>

              {user.phone_number && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Phone:</span>
                  <span className="text-sm">{user.phone_number}</span>
                </div>
              )}

              {user.address && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Address:</span>
                  <span className="text-sm">{user.address}</span>
                </div>
              )}

              {user.bio && (
                <div className="flex items-start space-x-3">
                  <UserIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm font-medium">Bio:</span>
                  <span className="text-sm">{user.bio}</span>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={user.is_active ? "success" : "destructive"}>
                  {user.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Joined:</span>
                <span className="text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Last Updated:</span>
                <span className="text-sm">
                  {new Date(user.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div>User not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}