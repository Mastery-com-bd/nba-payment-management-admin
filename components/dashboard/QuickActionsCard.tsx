"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Plus, Edit, BarChart3, Users, Settings, FileText } from "lucide-react";
import Link from "next/link";

interface QuickAction {
    icon: React.ReactNode;
    label: string;
    href: string;
    color: string;
}

export default function QuickActionsCard() {
    const actions: QuickAction[] = [
        {
            icon: <Plus className="w-5 h-5" />,
            label: "Create Quiz",
            href: "/content/create",
            color: "accent-blue",
        },
        {
            icon: <Edit className="w-5 h-5" />,
            label: "Edit Quiz",
            href: "/content",
            color: "accent-purple",
        },
        {
            icon: <BarChart3 className="w-5 h-5" />,
            label: "View Analytics",
            href: "/analytics",
            color: "accent-orange",
        },
        {
            icon: <Users className="w-5 h-5" />,
            label: "Manage Users",
            href: "/users",
            color: "accent-blue",
        },
        {
            icon: <FileText className="w-5 h-5" />,
            label: "View Reports",
            href: "/analytics",
            color: "accent-purple",
        },
        {
            icon: <Settings className="w-5 h-5" />,
            label: "Settings",
            href: "/settings",
            color: "accent-orange",
        },
    ];

    const getColorClasses = (color: string) => {
        const colorMap: Record<string, string> = {
            "accent-blue": "bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200",
            "accent-purple": "bg-gray-50 text-gray-700 border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200",
            "accent-orange": "bg-gray-50 text-gray-700 border-gray-200 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200",
        };
        return colorMap[color] || colorMap["accent-blue"];
    };

    return (
        <Card className="bg-white">
            <CardHeader>
                <CardTitle className="text-lg text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    {actions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1.5 ${getColorClasses(
                                action.color
                            )}`}
                        >
                            {action.icon}
                            <span className="text-xs font-medium text-center">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
