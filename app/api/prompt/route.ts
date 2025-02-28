import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const promptFilePath = path.join(
  process.cwd(),
  "app/api",
  "scripting-prompt.md"
);

export async function GET() {
  try {
    await fs.access(promptFilePath);
    const content = await fs.readFile(promptFilePath, "utf-8");
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ content: "Default scripting prompt" });
  }
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    await fs.writeFile(promptFilePath, content.trim(), "utf-8");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update prompt" },
      { status: 500 }
    );
  }
}
