// import fs from "fs/promises";
// import path from "path";

// const promptFilePath = path.join(process.cwd(), "scripting-prompt.md");

// export async function getScriptingPrompt(): Promise<string> {
//   try {
//     const content = await fs.readFile(promptFilePath, "utf-8");
//     return content;
//   } catch (error) {
//     console.error("Error reading scripting prompt:", error);
//     return "Default scripting prompt";
//   }
// }

// export async function updateScriptingPrompt(newPrompt: string): Promise<void> {
//   try {
//     await fs.writeFile(promptFilePath, newPrompt, "utf-8");
//   } catch (error) {
//     console.error("Error updating scripting prompt:", error);
//   }
// }
