# Complex Example

This paragraph has **bold _nested italic_** text. It also has `inline code with **bold**` which should be preserved! 

```typescript
// Code block with markdown inside
function format(text: string): string {
  // This **bold** should be preserved
  return text.replace(/\s+/, ' ');
  // So should this *italic*
}
```

The end!
