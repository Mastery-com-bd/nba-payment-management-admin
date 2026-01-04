"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

interface LineChartCardProps {
    title: string;
    value: string;
    data: Array<{ name: string; value: number }>;
    color?: string;
    insight?: string;
}

export default function LineChartCard({
    title,
    value,
    data,
    color = "#A78BFA",
    insight,
}: LineChartCardProps) {
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
                        <LineChart data={data}>
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
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={color}
                                strokeWidth={2}
                                dot={{ fill: color, r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
