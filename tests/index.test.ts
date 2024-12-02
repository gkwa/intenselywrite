import { describe, it, expect } from "vitest"
import { processFile } from "../src"
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const fixturesDir = path.join(__dirname, "fixtures")
const skipTests = new Set<string>([])

const defaultOptions = {
  preserveHeaders: true,
  preserveListItems: true,
}

describe("Markdown processor with fixtures", async () => {
  const files = await fs.readdir(fixturesDir)
  const inputFiles = files.filter(
    (f) => !f.includes(".golden") && !f.includes(".output") && f.endsWith(".md"),
  )

  inputFiles.forEach((inputFile) => {
    const testName = path.basename(inputFile, ".md")

    if (skipTests.has(testName)) {
      it.skip(testName, () => {})
      return
    }

    it(testName, async () => {
      const inputPath = path.join(fixturesDir, inputFile)
      const goldenPath = path.join(fixturesDir, `${testName}.golden.md`)
      const outputPath = path.join(fixturesDir, `${testName}.output.md`)

      await processFile(inputPath, outputPath, defaultOptions)

      const goldenContent = await fs.readFile(goldenPath, "utf-8")
      const outputContent = await fs.readFile(outputPath, "utf-8")

      expect(outputContent.trim()).toBe(goldenContent.trim())

      await fs.unlink(outputPath)
    })
  })
})
