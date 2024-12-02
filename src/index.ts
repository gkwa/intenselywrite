import nlp from "compromise"
import fs from "fs/promises"

export interface SplitTextOptions {
  preserveHeaders?: boolean
  preserveListItems?: boolean
}

export async function processFile(
  inputPath: string,
  outputPath: string,
  options: SplitTextOptions = {},
) {
  const text = await fs.readFile(inputPath, "utf-8")
  const result = splitTextPreserveMarkdown(text, options)
  await fs.writeFile(outputPath, result)
}

export function splitTextPreserveMarkdown(text: string, options: SplitTextOptions = {}): string {
  const lines = text.split("\n")
  const result: string[] = []
  let inCodeBlock = false
  let currentBlock: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Handle code block boundaries
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        // Starting a code block
        currentBlock = [line]
        inCodeBlock = true
      } else {
        // Ending a code block
        currentBlock.push(line)
        result.push(currentBlock.join("\n"))
        currentBlock = []
        inCodeBlock = false
      }
      continue
    }

    // Handle content within code blocks
    if (inCodeBlock) {
      currentBlock.push(line)
      continue
    }

    // Handle regular markdown content
    if (
      line === "" ||
      (options.preserveHeaders && line.startsWith("#")) ||
      (options.preserveListItems && line.startsWith("-"))
    ) {
      result.push(line)
    } else {
      const doc = nlp(line)
      const sentences = doc.sentences().out("array") as string[]
      result.push(...sentences.map((s: string) => s.trim()))
    }
  }

  // Post-process for paragraph formatting
  return result
    .map((line: string, i: number, arr: string[]) => {
      if (i === arr.length - 1) return line
      if (line === "") return line
      if (line.startsWith("#")) return line
      if (line.startsWith("-")) return line
      if (line.startsWith("```") || line.includes("```")) return line
      if (arr[i + 1] === "") return line
      if (arr[i + 1].startsWith("#")) return line
      if (arr[i + 1].startsWith("-")) return line
      if (arr[i + 1].startsWith("```")) return line

      const nextLineIsPartOfParagraph =
        arr[i + 1] &&
        !arr[i + 1].startsWith("#") &&
        !arr[i + 1].startsWith("-") &&
        !arr[i + 1].startsWith("```") &&
        arr[i + 1] !== ""

      return nextLineIsPartOfParagraph ? line + "\n" : line
    })
    .join("\n")
}
