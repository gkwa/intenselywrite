# markdown-sentence-splitter

A tool for breaking up dense paragraphs in markdown files by splitting sentences into separate paragraphs while preserving markdown formatting.

## Motivation 

Dense paragraphs can be difficult to read and process, especially in documentation or long-form content. This tool helps improve readability by splitting each sentence onto its own line, while carefully preserving markdown formatting, lists, code blocks, and other structural elements.

For example, this:
```markdown
Testing questions in [**TruthfulQA**](https://github.com/sylinrl/TruthfulQA) are crafted *adversarially* according to common misconceptions. The benchmark comprises 817 questions spanning multiple topics. The goal is to assess truthful behavior in language models.
```

Becomes:
```markdown 
Testing questions in [**TruthfulQA**](https://github.com/sylinrl/TruthfulQA) are crafted *adversarially* according to common misconceptions.

The benchmark comprises 817 questions spanning multiple topics.

The goal is to assess truthful behavior in language models.
```

## Usage

```bash
git clone https://github.com/gkwa/intenselywrite
cd intenselywrite
corepack enable && corepack prepare
pnpm run test
```
