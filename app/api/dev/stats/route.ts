import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

let startTime = Date.now();
let requestCount = 0;
let errorCount = 0;

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (
      !session?.user?.email ||
      session.user.email !== "vitor.nakahh@gmail.com"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requestCount++;

    // Simulate system stats (in production, get real metrics)
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const memoryUsage = process.memoryUsage();

    const stats = {
      uptime,
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      },
      cpu: Math.floor(Math.random() * 30) + 10, // Simulated CPU usage
      requests: requestCount,
      errors: errorCount,
      responseTime: Math.floor(Math.random() * 100) + 50, // Simulated response time
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    errorCount++;
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
