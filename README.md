# markdown-sentence-splitter

A tool for breaking up dense paragraphs in markdown files by splitting sentences into separate paragraphs while preserving markdown formatting.

## Motivation

Dense paragraphs can be difficult to read and process, especially in documentation or long-form content. This tool helps improve readability by splitting each sentence onto its own line, while carefully preserving markdown formatting, lists, code blocks, and other structural elements.

For example, this:

```markdown
Testing questions in [**TruthfulQA**](https://github.com/sylinrl/TruthfulQA) are crafted _adversarially_ according to common misconceptions. The benchmark comprises 817 questions spanning multiple topics. The goal is to assess truthful behavior in language models.
```

Becomes:

```markdown
Testing questions in [**TruthfulQA**](https://github.com/sylinrl/TruthfulQA) are crafted _adversarially_ according to common misconceptions.

The benchmark comprises 817 questions spanning multiple topics.

The goal is to assess truthful behavior in language models.
```

## Installation

```bash
npm install markdown-sentence-splitter
```

## Usage

```javascript
const { processFile } = require("markdown-sentence-splitter")

// Process a file
await processFile("input.md", "output.md")
```

## Features

- Splits sentences into separate paragraphs
- Preserves markdown formatting (links, emphasis, etc)
- Handles lists, tables, and other block elements
- Preserves code blocks and blockquotes
- Maintains nested list indentation
- Option to preserve headers and list items

## Special Cases Handled

- Code blocks
- Block quotes
- Ordered and unordered lists
- Tables
- Headers
- Nested formatting (bold within links, etc)
- Complex list hierarchies
- Indentation preservation when needed

## Configuration

```javascript
const options = {
  preserveHeaders: true, // Don't split sentences in headers
  preserveListItems: true, // Don't split sentences in list items
}

await processFile("input.md", "output.md", options)
```
