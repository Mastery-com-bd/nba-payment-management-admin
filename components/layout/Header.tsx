"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Search,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "../shared/theme-toggle";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-6">
      <SidebarTrigger className="-ml-2" />
      <Separator orientation="vertical" className="h-6" />
      
      <div className="flex flex-1 items-center gap-4">
        <div className="relative hidden md:block w-64 lg:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
        </Button>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user.avatar_url || "/placeholder.svg"}
                    alt={user.full_name}
                  />
                  <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user.avatar_url || "/placeholder.svg"}
                    alt={user.full_name}
                  />
                  <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.full_name}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/analytics" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              {user.role === "admin" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/users" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Manage Users
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
