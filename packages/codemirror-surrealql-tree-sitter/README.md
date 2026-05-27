# @surrealdb/codemirror-surrealql-tree-sitter

SurrealQL [CodeMirror 6](https://codemirror.net/) language support using the tree-sitter grammar (via [`@surrealdb/tree-sitter-lezer`](../../../tree-sitter-lezer)).

## Install

```bash
bun add @surrealdb/codemirror-surrealql-tree-sitter @surrealdb/tree-sitter-lezer
```

Build WASM first (see tree-sitter-lezer README).

## Usage

```ts
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { surrealql } from "@surrealdb/codemirror-surrealql-tree-sitter";

const support = await surrealql();
const view = new EditorView({
  state: EditorState.create({
    doc: "SELECT * FROM person;",
    extensions: [support],
  }),
  parent: document.body,
});
```

## Testing

Layered suite comparing against `@surrealdb/lezer`:

| Tier | Gate |
|------|------|
| 0 | Tree-sitter corpus (strict) |
| 1 | All lezer fixtures parse without throw |
| 2 | Loose structural similarity vs lezer (ratcheting baselines) |
| 3 | Keyword nodes + highlight smoke |
| 4 | EditorState language data, syntax tree, indent |

```bash
bun test
bun run test:update-baselines   # refresh tier2 comparison-summary.json
bun run test:report             # worst fixtures by kindJaccard
```

## v1 limitations

- Fragment tops (`PermissionInput`, `IndexInput`, …) not supported — tree-sitter only has `source_file`
- No `sinceProp` / `untilProp` version linter
- No `parseMixed` JavaScript embedding

Keep using `@surrealdb/codemirror` (lezer) for those until the tree-sitter grammar grows matching rules.
