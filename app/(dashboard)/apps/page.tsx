"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Plus, Check } from "lucide-react";

const apps = [
    {
        id: 1,
        name: "Analytics Pro",
        description: "Advanced analytics and reporting",
        installed: true,
        icon: "📊",
    },
    {
        id: 2,
        name: "User Management",
        description: "Comprehensive user administration",
        installed: true,
        icon: "👥",
    },
    {
        id: 3,
        name: "Content Editor",
        description: "Rich text editor for content creation",
        installed: false,
        icon: "✏️",
    },
    {
        id: 4,
        name: "Email Marketing",
        description: "Send targeted email campaigns",
        installed: false,
        icon: "📧",
    },
];

export default function AppsPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 pl-0 md:pl-20">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Apps & Integrations</h1>
                        <p className="text-gray-600">Manage your installed apps and integrations</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] hover:bg-[#1e3a8a] text-white rounded-lg transition-all">
                        <Plus className="w-4 h-4" />
                        Browse Apps
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {apps.map((app) => (
                        <Card key={app.id} className="bg-white">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl">{app.icon}</div>
                                        <div>
                                            <CardTitle className="text-gray-900">{app.name}</CardTitle>
                                            <p className="text-sm text-gray-500 mt-1">{app.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <button
                                    className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                                        app.installed
                                            ? "bg-green-100 text-green-700 border border-green-200 flex items-center justify-center gap-2"
                                            : "bg-[#1E40AF] hover:bg-[#1e3a8a] text-white"
                                    }`}
                                >
                                    {app.installed ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Installed
                                        </>
                                    ) : (
                                        "Install"
                                    )}
                                </button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
