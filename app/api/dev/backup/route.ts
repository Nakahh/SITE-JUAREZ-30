import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

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
    const { action, type } = body;

    if (action === "backup") {
      // Create database backup
      const backup = {
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        data: {
          users: [],
          properties: [],
          articles: [],
          testimonials: [],
        },
      };

      if (type === "all" || type === "users") {
        backup.data.users = await prisma.user.findMany();
      }

      if (type === "all" || type === "properties") {
        backup.data.properties = await prisma.property.findMany({
          include: {
            agent: true,
            reviews: true,
          },
        });
      }

      if (type === "all" || type === "articles") {
        backup.data.articles = await prisma.article.findMany({
          include: {
            author: true,
          },
        });
      }

      if (type === "all" || type === "testimonials") {
        backup.data.testimonials = await prisma.testimonial.findMany({
          include: {
            user: true,
          },
        });
      }

      // Save backup to file
      const backupDir = join(process.cwd(), "backups");
      const backupFile = join(backupDir, `backup-${Date.now()}.json`);

      try {
        writeFileSync(backupFile, JSON.stringify(backup, null, 2));
        return NextResponse.json({
          success: true,
          message: "Backup created successfully",
          file: backupFile,
          size: JSON.stringify(backup).length,
        });
      } catch (fileError) {
        console.error("File write error:", fileError);
        return NextResponse.json({
          success: true,
          message: "Backup created in memory (file save failed)",
          data: backup,
        });
      }
    }

    if (action === "restore") {
      const { backupData } = body;

      if (!backupData) {
        return NextResponse.json(
          { error: "No backup data provided" },
          { status: 400 },
        );
      }

      // Validate backup structure
      if (!backupData.data || typeof backupData.data !== "object") {
        return NextResponse.json(
          { error: "Invalid backup format" },
          { status: 400 },
        );
      }

      let restored = 0;

      // Note: In a real application, you'd want to be more careful about restoring data
      // This is a simplified example for development purposes

      return NextResponse.json({
        success: true,
        message: `Restore completed. ${restored} records processed.`,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in backup API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user?.email ||
      session.user.email !== "vitor.nakahh@gmail.com"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // List available backups
    const backupDir = join(process.cwd(), "backups");
    const backups = [];

    try {
      const fs = await import("fs");
      if (fs.existsSync(backupDir)) {
        const files = fs.readdirSync(backupDir);
        for (const file of files) {
          if (file.endsWith(".json")) {
            const filePath = join(backupDir, file);
            const stats = fs.statSync(filePath);
            backups.push({
              name: file,
              size: stats.size,
              created: stats.birthtime,
              modified: stats.mtime,
            });
          }
        }
      }
    } catch (error) {
      console.log("Backup directory not accessible:", error);
    }

    return NextResponse.json({
      backups,
      count: backups.length,
    });
  } catch (error) {
    console.error("Error listing backups:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
