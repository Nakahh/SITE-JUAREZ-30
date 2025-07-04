"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Signal,
} from "lucide-react";

interface RealTimeWidgetProps {
  title: string;
  value: number;
  unit?: string;
  icon: any;
  trend?: "up" | "down" | "stable";
  trendValue?: number;
  status?: "good" | "warning" | "critical";
  threshold?: number;
  maxValue?: number;
  realTime?: boolean;
  sparklineData?: number[];
}

export function RealTimeWidget({
  title,
  value,
  unit = "",
  icon: Icon,
  trend = "stable",
  trendValue = 0,
  status = "good",
  threshold = 80,
  maxValue = 100,
  realTime = true,
  sparklineData = [],
}: RealTimeWidgetProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setAnimatedValue(value);
      setIsAnimating(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [value]);

  const getStatusColor = () => {
    if (status === "critical") return "text-red-400";
    if (status === "warning") return "text-yellow-400";
    return "text-green-400";
  };

  const getStatusBg = () => {
    if (status === "critical") return "bg-red-900/20 border-red-500";
    if (status === "warning") return "bg-yellow-900/20 border-yellow-500";
    return "bg-green-900/20 border-green-500";
  };

  const getTrendIcon = () => {
    if (trend === "up")
      return <TrendingUp className="h-3 w-3 text-green-400" />;
    if (trend === "down")
      return <TrendingDown className="h-3 w-3 text-red-400" />;
    return null;
  };

  const progressValue = Math.min((animatedValue / maxValue) * 100, 100);

  return (
    <Card
      className={`${getStatusBg()} transition-all duration-300 hover:scale-105`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${status === "critical" ? "bg-red-500/20" : status === "warning" ? "bg-yellow-500/20" : "bg-blue-500/20"}`}
            >
              <Icon className={`h-5 w-5 ${getStatusColor()}`} />
            </div>
            {realTime && (
              <div className="flex items-center gap-1">
                <Signal className="h-3 w-3 text-blue-400" />
                <span className="text-xs text-blue-400">LIVE</span>
              </div>
            )}
          </div>
          {status === "critical" && (
            <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />
          )}
          {status === "good" && (
            <CheckCircle className="h-4 w-4 text-green-400" />
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-slate-400 font-medium">{title}</p>

          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-1">
              <span
                className={`text-2xl font-bold transition-all duration-500 ${isAnimating ? "scale-110" : ""} ${getStatusColor()}`}
              >
                {animatedValue.toFixed(unit === "%" || unit === "ms" ? 0 : 1)}
              </span>
              <span className="text-sm text-slate-400">{unit}</span>
            </div>

            {trend !== "stable" && (
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span
                  className={`text-xs ${trend === "up" ? "text-green-400" : "text-red-400"}`}
                >
                  {Math.abs(trendValue).toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <Progress
              value={progressValue}
              className="h-2"
              style={{
                background: "rgba(71, 85, 105, 0.3)",
              }}
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>0</span>
              <span>
                {maxValue}
                {unit}
              </span>
            </div>
          </div>

          {/* Threshold indicator */}
          {value > threshold && (
            <div className="flex items-center gap-1 mt-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-xs text-yellow-400">
                Acima do limite ({threshold}
                {unit})
              </span>
            </div>
          )}

          {/* Mini sparkline */}
          {sparklineData.length > 0 && (
            <div className="mt-3">
              <div className="flex items-end gap-0.5 h-8">
                {sparklineData.slice(-20).map((point, index) => (
                  <div
                    key={index}
                    className={`flex-1 rounded-sm transition-all duration-300 ${getStatusColor().replace("text", "bg")}`}
                    style={{
                      height: `${Math.max((point / Math.max(...sparklineData)) * 100, 5)}%`,
                      opacity: 0.7 + (index / sparklineData.length) * 0.3,
                    }}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">Últimos 20 pontos</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Specialized widgets
export function CPUWidget({
  value,
  sparklineData,
}: {
  value: number;
  sparklineData?: number[];
}) {
  return (
    <RealTimeWidget
      title="CPU Usage"
      value={value}
      unit="%"
      icon={Zap}
      trend={value > 70 ? "up" : value < 30 ? "down" : "stable"}
      trendValue={Math.random() * 10}
      status={value > 80 ? "critical" : value > 60 ? "warning" : "good"}
      threshold={70}
      maxValue={100}
      sparklineData={sparklineData}
    />
  );
}

export function MemoryWidget({
  value,
  sparklineData,
}: {
  value: number;
  sparklineData?: number[];
}) {
  return (
    <RealTimeWidget
      title="Memory Usage"
      value={value}
      unit="%"
      icon={Activity}
      trend={value > 80 ? "up" : value < 40 ? "down" : "stable"}
      trendValue={Math.random() * 15}
      status={value > 85 ? "critical" : value > 70 ? "warning" : "good"}
      threshold={75}
      maxValue={100}
      sparklineData={sparklineData}
    />
  );
}

export function ResponseTimeWidget({
  value,
  sparklineData,
}: {
  value: number;
  sparklineData?: number[];
}) {
  return (
    <RealTimeWidget
      title="Response Time"
      value={value}
      unit="ms"
      icon={Clock}
      trend={value > 500 ? "up" : value < 200 ? "down" : "stable"}
      trendValue={Math.random() * 20}
      status={value > 1000 ? "critical" : value > 500 ? "warning" : "good"}
      threshold={500}
      maxValue={2000}
      sparklineData={sparklineData}
    />
  );
}
