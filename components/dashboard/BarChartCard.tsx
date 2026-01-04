"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

interface BarChartCardProps {
    title: string;
    value: string;
    data: Array<{ name: string; value: number }>;
    colors?: string[];
}

export default function BarChartCard({
    title,
    value,
    data,
    colors = ["#FB923C", "#A78BFA", "#60A5FA"],
}: BarChartCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{title}</CardTitle>
                    <div className="text-xl font-bold text-gray-900">{value}</div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis 
                                dataKey="name" 
                                stroke="#6B7280"
                                style={{ fontSize: '11px' }}
                            />
                            <YAxis 
                                stroke="#6B7280"
                                style={{ fontSize: '11px' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    color: '#111827'
                                }}
                            />
                            <Bar
                                dataKey="value"
                                fill={colors[0]}
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
