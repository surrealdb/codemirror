<br>

<p align="center">
    <img width=120 src="https://raw.githubusercontent.com/surrealdb/icons/main/surreal.svg" />
</p>

<h3 align="center">SurrealQL Support for CodeMirror</h3>

<br>

<p align="center">
    <a href="https://github.com/surrealdb/surrealql-codemirror"><img src="https://img.shields.io/badge/status-beta-ff00bb.svg?style=flat-square"></a>
    &nbsp;
    <a href="https://www.npmjs.com/package/@surrealdb/codemirror"><img src="https://img.shields.io/npm/v/%40surrealdb%2Fcodemirror?style=flat-square"></a>
</p>

<p align="center">
    <a href="https://surrealdb.com/discord"><img src="https://img.shields.io/discord/902568124350599239?label=discord&style=flat-square&color=5a66f6"></a>
    &nbsp;
    <a href="https://twitter.com/surrealdb"><img src="https://img.shields.io/badge/twitter-follow_us-1d9bf0.svg?style=flat-square"></a>
    &nbsp;
    <a href="https://www.linkedin.com/company/surrealdb/"><img src="https://img.shields.io/badge/linkedin-connect_with_us-0a66c2.svg?style=flat-square"></a>
    &nbsp;
    <a href="https://www.youtube.com/channel/UCjf2teVEuYVvvVC-gFZNq6w"><img src="https://img.shields.io/badge/youtube-subscribe-fc1c1c.svg?style=flat-square"></a>
</p>

# @surrealdb/codemirror

This library provides full support for the SurrealQL language within your CodeMirror editors.

Some features include:
- Intelligent SurrealQL highlighting
- Folding support for blocks, objects, and arrays
- Automatic indentation support
- Support for comment toggling
- Embedded JavaScript highlighting

## How to install

Install it with:

```sh
# using npm
npm i @surrealdb/codemirror
# or using pnpm
pnpm i @surrealdb/codemirror
# or using yarn
yarn add @surrealdb/codemirror
```

Next, just import it with:

```ts
const { surrealql } = require("@surrealdb/codemirror");
```

or when you use modules:

```ts
import { surrealql } from "@surrealdb/codemirror";
```

## Example usage

```ts
import { surrealql } from "@surrealdb/codemirror";

const state = EditorState.create({
    doc: "SELECT * FROM table",
    extensions: [
        surrealql()
    ]
});

const editor = new EditorView({
    parent: document.getElementById("editor"),
    state: state,
});
```