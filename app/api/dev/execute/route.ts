import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Allowed commands for security
const ALLOWED_COMMANDS = [
  "npm",
  "yarn",
  "pnpm",
  "ls",
  "df",
  "free",
  "ps",
  "pwd",
  "whoami",
  "date",
  "uptime",
  "node",
  "git",
  "cat",
  "head",
  "tail",
  "grep",
  "find",
  "echo",
  "rm",
  "mkdir",
  "touch",
  "cp",
  "mv",
  "lsof",
  "kill",
  "killall",
];

function isCommandAllowed(command: string): boolean {
  const firstWord = command.trim().split(" ")[0];
  return ALLOWED_COMMANDS.includes(firstWord);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (
      !session?.user?.email ||
      session.user.email !== "vitor.nakahh@gmail.com"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { command } = body;

    if (!command || typeof command !== "string") {
      return NextResponse.json({ error: "Invalid command" }, { status: 400 });
    }

    // Security check
    if (!isCommandAllowed(command)) {
      return NextResponse.json(
        {
          error: "Command not allowed for security reasons",
          output: `Command '${command.split(" ")[0]}' is not in the allowed list.`,
        },
        { status: 403 },
      );
    }

    try {
      // Execute command with timeout
      const { stdout, stderr } = await execAsync(command, {
        timeout: 30000, // 30 seconds timeout
        maxBuffer: 1024 * 1024, // 1MB buffer
      });

      const output =
        stdout || stderr || "Command executed successfully (no output)";

      return NextResponse.json({
        success: true,
        output,
        command,
      });
    } catch (execError: any) {
      console.error("Command execution error:", execError);

      return NextResponse.json({
        success: false,
        output: execError.message || "Command execution failed",
        command,
      });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
