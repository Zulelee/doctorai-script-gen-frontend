import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

const promptFilePath = path.join(
  process.cwd(),
  "app/api",
  "scripting-prompt.md"
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      await fs.access(promptFilePath);
      const content = await fs.readFile(promptFilePath, "utf-8");
      res.status(200).json({ content });
    } catch (error) {
      res.status(200).json({ content: "Default scripting prompt" });
    }
  } else if (req.method === "POST") {
    try {
      const { content } = req.body;
      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Invalid content" });
      }

      const directory = path.dirname(promptFilePath);
      await fs.mkdir(directory, { recursive: true });
      await fs.writeFile(promptFilePath, content.trim(), "utf-8");
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update prompt" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
