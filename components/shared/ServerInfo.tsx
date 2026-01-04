"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Globe, Server } from "lucide-react";
import { useEffect, useState } from "react";

interface ServerHealth {
  success: boolean;
  message: string;
  timestamp: string;
  environment: string;
}

export function ServerInfo() {
  const [serverHealth, setServerHealth] = useState<ServerHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServerHealth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/health`
        );
        if (response.ok) {
          const data = await response.json();
          setServerHealth(data);
        } else {
          setError("Failed to fetch server info");
        }
      } catch (err) {
        setError("Server unreachable");
      } finally {
        setLoading(false);
      }
    };

    fetchServerHealth();
    // Refresh every 30 seconds
    const interval = setInterval(fetchServerHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            System Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            System Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="destructive">Server Offline</Badge>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-4 w-4" />
          System Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status</span>
          <Badge variant={serverHealth?.success ? "success" : "destructive"}>
            {serverHealth?.success ? "Online" : "Offline"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Environment</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            {serverHealth?.environment}
          </Badge>
        </div>

        <div className="space-y-1">
          <span className="text-sm font-medium flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Last Updated
          </span>
          <p className="text-xs text-muted-foreground">
            {serverHealth?.timestamp
              ? new Date(serverHealth.timestamp).toLocaleString()
              : "Unknown"}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-sm font-medium">Message</span>
          <p className="text-xs text-muted-foreground">
            {serverHealth?.message || "No message"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
