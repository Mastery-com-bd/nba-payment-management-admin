"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface DonutChartCardProps {
    title: string;
    value: string;
    data: Array<{ name: string; value: number; color: string }>;
    centerText?: string;
    insight?: string;
}

export default function DonutChartCard({
    title,
    value,
    data,
    centerText,
    insight,
}: DonutChartCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{title}</CardTitle>
                    <div className="text-xl font-bold text-gray-900">{value}</div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    color: '#111827'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {centerText && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{centerText}</div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
