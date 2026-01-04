"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { BarChart3 } from "lucide-react";

interface ProgressCardProps {
    title: string;
    value: string;
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    children?: React.ReactNode;
}

export default function ProgressCard({
    title,
    value,
    tabs,
    activeTab,
    onTabChange,
    children,
}: ProgressCardProps) {
    return (
        <Card className="bg-white">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#A78BFA]" />
                    <CardTitle className="text-base text-gray-900">{title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-3">
                    <div className="text-3xl font-bold text-gray-900">{value}</div>
                </div>
                
                {/* Tabs */}
                <div className="flex gap-1.5 mb-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab)}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                                activeTab === tab
                                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-transparent"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {children}
            </CardContent>
        </Card>
    );
}
