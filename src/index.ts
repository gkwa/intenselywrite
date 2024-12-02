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

function isTableRow(line: string): boolean {
  return line.trim().startsWith("|") && line.trim().endsWith("|")
}

function isTableDelimiter(line: string): boolean {
  return (
    line.trim().startsWith("|") && line.trim().endsWith("|") && /^\|[-:|. ]+\|$/.test(line.trim())
  )
}

function getIndentLevel(line: string): number {
  const match = line.match(/^(\s*)/)
  return match ? match[1].length : 0
}

function getListMarker(line: string): string | null {
  const match = line.trim().match(/^(\d+\.|-|\*|\+)\s/)
  return match ? match[1] : null
}

function isListContentLine(line: string, currentIndentLevel: number): boolean {
  return getIndentLevel(line) >= currentIndentLevel && !getListMarker(line)
}

function isBlockQuoteLine(line: string): boolean {
  return line.trim().startsWith(">")
}

export function splitTextPreserveMarkdown(text: string, options: SplitTextOptions = {}): string {
  const lines = text.split("\n")
  const result: string[] = []
  let inCodeBlock = false
  let inBlockQuote = false
  let inTable = false
  let currentBlock: string[] = []
  let currentIndentLevel = 0
  let inListItem = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const listMarker = getListMarker(line)
    const isBlockQuote = isBlockQuoteLine(line)

    // Handle code block boundaries
    if (line.trim().startsWith("```")) {
      if (!inCodeBlock) {
        currentBlock = [line]
        inCodeBlock = true
      } else {
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

    // Track table state
    if (isTableRow(line) || isTableDelimiter(line)) {
      inTable = true
      inListItem = false
    } else if (line.trim() === "") {
      inTable = false
      inListItem = false
    }

    // Track blockquote state
    if (isBlockQuote) {
      inBlockQuote = true
    } else if (line.trim() === "") {
      inBlockQuote = false
    }

    // Handle regular markdown content
    if (line === "" || inTable || (options.preserveHeaders && line.startsWith("#"))) {
      result.push(line)
      continue
    }

    // Handle list items and their content
    if (listMarker) {
      currentIndentLevel = getIndentLevel(line)
      const content = line.slice(line.indexOf(listMarker) + listMarker.length).trim()

      // Mark that we're in a list item
      inListItem = true

      // Split the content into sentences
      const doc = nlp(content)
      const sentences = doc.sentences().out("array") as string[]

      // Add first sentence with list marker
      result.push(`${" ".repeat(currentIndentLevel)}${listMarker} ${sentences[0].trim()}`)

      // Add remaining sentences with proper indentation
      for (let i = 1; i < sentences.length; i++) {
        result.push("") // Add blank line before new sentence
        result.push(
          `${" ".repeat(currentIndentLevel + listMarker.length + 1)}${sentences[i].trim()}`,
        )
      }
    } else if (isListContentLine(line, currentIndentLevel) && inListItem) {
      // For content belonging to a list item
      if (isBlockQuote) {
        // Don't add extra newlines between consecutive blockquotes
        const prevLineIsBlockQuote = i > 0 && isBlockQuoteLine(lines[i - 1])
        if (!prevLineIsBlockQuote) {
          result.push("")
        }
        result.push(line)
      } else {
        // For non-blockquote content in list items
        const doc = nlp(line.trim())
        const sentences = doc.sentences().out("array") as string[]

        result.push("") // Add blank line before continuing list content
        for (let i = 0; i < sentences.length; i++) {
          if (i > 0) result.push("") // Add blank line between sentences
          result.push(`${" ".repeat(currentIndentLevel + 2)}${sentences[i].trim()}`)
        }
      }
    } else {
      // Regular paragraph content - no indentation preservation
      const doc = nlp(line.trim()) // Use trim() here to remove any indentation
      const sentences = doc.sentences().out("array") as string[]
      result.push(...sentences.map((s) => s.trim())) // No indentation for regular paragraphs
    }
  }

  // Post-process for paragraph formatting
  return result
    .map((line: string, i: number, arr: string[]) => {
      if (i === arr.length - 1) return line
      if (line === "") return line
      if (isTableRow(line) || isTableDelimiter(line)) return line
      if (line.startsWith("#")) return line
      if (getListMarker(line)) return line
      if (line.includes("```") || line.startsWith("```")) return line
      if (arr[i + 1] === "") return line
      if (arr[i + 1].startsWith("#")) return line
      if (getListMarker(arr[i + 1])) return line
      if (arr[i + 1].includes("```")) return line

      const currentLineInQuote = line.trim().startsWith(">")
      const nextLineInQuote = arr[i + 1] && arr[i + 1].trim().startsWith(">")
      const currentLineInTable = isTableRow(line) || isTableDelimiter(line)
      const nextLineInTable = arr[i + 1] && (isTableRow(arr[i + 1]) || isTableDelimiter(arr[i + 1]))

      // Only add newline if we're not in a continuous block quote or table
      if ((currentLineInQuote && nextLineInQuote) || (currentLineInTable && nextLineInTable)) {
        return line
      }

      const nextLineIsPartOfParagraph =
        arr[i + 1] &&
        !arr[i + 1].startsWith("#") &&
        !getListMarker(arr[i + 1]) &&
        !arr[i + 1].includes("```") &&
        !isTableRow(arr[i + 1]) &&
        !isTableDelimiter(arr[i + 1]) &&
        arr[i + 1] !== ""

      return nextLineIsPartOfParagraph ? line + "\n" : line
    })
    .join("\n")
}
