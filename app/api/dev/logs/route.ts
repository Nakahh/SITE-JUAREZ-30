import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// In-memory log storage (in production, use a proper logging service)
const logs: any[] = [];

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

    // Generate some sample logs for demonstration
    const currentTime = new Date();
    const sampleLogs = [
      {
        id: `${Date.now()}-1`,
        timestamp: new Date(currentTime.getTime() - 5000),
        level: "info",
        message: "Server started successfully",
        component: "Server",
      },
      {
        id: `${Date.now()}-2`,
        timestamp: new Date(currentTime.getTime() - 3000),
        level: "info",
        message: "Database connection established",
        component: "Database",
      },
      {
        id: `${Date.now()}-3`,
        timestamp: new Date(currentTime.getTime() - 1000),
        level: "debug",
        message: "User authentication successful",
        component: "Auth",
      },
      {
        id: `${Date.now()}-4`,
        timestamp: currentTime,
        level: "info",
        message: "API request processed",
        component: "API",
      },
    ];

    return NextResponse.json(sampleLogs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user?.email ||
      session.user.email !== "vitor.nakahh@gmail.com"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { level, message, component } = body;

    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level,
      message,
      component,
    };

    logs.push(newLog);

    // Keep only last 1000 logs
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000);
    }

    return NextResponse.json({ success: true, log: newLog });
  } catch (error) {
    console.error("Error adding log:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
