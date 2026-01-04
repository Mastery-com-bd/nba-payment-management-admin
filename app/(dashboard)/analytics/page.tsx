"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { adminApi } from "@/lib/api/adminApi";
import { Analytics } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [engagementData, setEngagementData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [analyticsRes, monthlyRes, dailyRes, engagementRes] = await Promise.all([
          adminApi.getAnalytics(),
          adminApi.getMonthlyGrowth(),
          adminApi.getDailyActivity(),
          adminApi.getEngagementTrend(),
        ]);

        if (analyticsRes.success && analyticsRes.data) {
          setAnalytics(analyticsRes.data);
        }
        if (monthlyRes.success && monthlyRes.data) {
          setMonthlyData(monthlyRes.data);
        }
        if (dailyRes.success && dailyRes.data) {
          setDailyData(dailyRes.data);
        }
        if (engagementRes.success && engagementRes.data) {
          setEngagementData(engagementRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into your platform performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Users
            </p>
            <p className="text-2xl font-bold">
              {loading ? "..." : analytics?.summary.totalUsers || 0}
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Quizzes
            </p>
            <p className="text-2xl font-bold">
              {loading ? "..." : analytics?.summary.totalQuizzes || 0}
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Questions
            </p>
            <p className="text-2xl font-bold">
              {loading ? "..." : analytics?.summary.totalQuestions || 0}
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Completed Attempts
            </p>
            <p className="text-2xl font-bold">
              {loading ? "..." : analytics?.summary.completedAttempts || 0}
            </p>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        color: "#111827",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stackId="1"
                      stroke="#60A5FA"
                      fill="#60A5FA"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="2"
                      stroke="#A78BFA"
                      fill="#A78BFA"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        color: "#111827",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="active" fill="#60A5FA" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="new" fill="#FB923C" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {loading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      color: "#111827",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="engagement"
                    stroke="#A78BFA"
                    strokeWidth={3}
                    dot={{ fill: "#A78BFA", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
