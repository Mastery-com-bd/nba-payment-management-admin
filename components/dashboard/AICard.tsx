"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Send } from "lucide-react";
import { useState } from "react";

interface AICardProps {
    title: string;
    subtitle: string;
    suggestions: string[];
}

export default function AICard({ title, subtitle, suggestions }: AICardProps) {
    const [input, setInput] = useState("");

    return (
        <Card className="bg-white relative overflow-hidden">
            {/* Background Image Effect */}
            <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-orange-200 via-amber-100 to-orange-300" />
            </div>
            
            <CardHeader className="relative z-10">
                <CardTitle className="text-3xl mb-2 text-gray-900">{title}</CardTitle>
                <p className="text-gray-600">{subtitle}</p>
            </CardHeader>
            <CardContent className="relative z-10">
                {/* Suggested Prompts */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => setInput(suggestion)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>

                {/* Input Field */}
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask something..."
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 pr-12"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-all">
                        <Send className="w-4 h-4 text-white" />
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
