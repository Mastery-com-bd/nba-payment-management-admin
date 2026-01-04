"use client";

import { BarChart3, FileText, Settings, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ServerInfo } from "@/components/shared/ServerInfo";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navItems = [
  { icon: BarChart3, href: "/analytics", label: "Dashboard" },
  { icon: Users, href: "/users", label: "Users" },
  { icon: FileText, href: "/content", label: "Content" },
  { icon: Settings, href: "/settings", label: "Settings" },
  { icon: User, href: "/profile", label: "Profile" },
  // { icon: Bell, href: "/notifications", label: "Notifications" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/analytics" className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <div className="w-5 h-5 rounded bg-primary-foreground"></div>
          </div>
          <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">
            WizdomMaster
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/analytics" &&
                    pathname?.startsWith(item.href));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <div className="group-data-[collapsible=icon]:hidden">
          <ServerInfo />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
