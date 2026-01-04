"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Plus, Clock } from "lucide-react";

interface Integration {
    name: string;
    description: string;
    time: string;
    icon?: string;
}

interface IntegrationsCardProps {
    title: string;
    subtitle: string;
    integrations: Integration[];
    legend?: Array<{ label: string; color: string }>;
}

export default function IntegrationsCard({
    title,
    subtitle,
    integrations,
    legend,
}: IntegrationsCardProps) {
    return (
        <Card className="bg-white relative overflow-hidden">
            {/* Background Image Effect */}
            <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-orange-300 via-red-200 to-orange-400" />
            </div>

            <CardHeader className="relative z-10">
                <CardTitle className="text-3xl mb-2 text-gray-900">{title}</CardTitle>
                <p className="text-gray-600">{subtitle}</p>
            </CardHeader>
            <CardContent className="relative z-10">
                {/* Legend */}
                {legend && (
                    <div className="flex gap-4 mb-6 text-xs">
                        {legend.map((item, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-gray-600">{item.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Integrations List */}
                <div className="space-y-3 mb-4">
                    {integrations.map((integration, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs">
                                    {integration.icon || integration.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-gray-900 font-medium text-sm">{integration.name}</p>
                                    <p className="text-xs text-gray-500">{integration.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                                <Clock className="w-3 h-3" />
                                <span>{integration.time}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add App Button */}
                <button className="w-full px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add app
                </button>
            </CardContent>
        </Card>
    );
}
