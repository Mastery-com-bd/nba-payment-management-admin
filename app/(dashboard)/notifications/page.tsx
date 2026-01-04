"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { AlertCircle, Bell, CheckCircle, Info, X } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "success",
    title: "System Update Complete",
    message: "Your system has been successfully updated to version 2.0",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "High Traffic Alert",
    message: "Your platform is experiencing unusually high traffic",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "New User Registration",
    message: "A new user has registered on your platform",
    time: "1 day ago",
    read: true,
  },
  {
    id: 4,
    type: "success",
    title: "Backup Completed",
    message: "Daily backup has been completed successfully",
    time: "2 days ago",
    read: true,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case "warning":
      return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    case "info":
      return <Info className="w-5 h-5 text-blue-600" />;
    default:
      return <Bell className="w-5 h-5 text-gray-500" />;
  }
};

export default function NotificationsPage() {
  return (
    <div className="min-h-screen p-4 sm:p-6 pl-0 md:pl-20">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Notifications
          </h1>
          <p className="text-gray-600">
            View and manage all your notifications
          </p>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`bg-white ${notification.read ? "opacity-60" : ""}`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-gray-900 font-medium mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {notification.message}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {notification.time}
                        </p>
                      </div>
                      <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
