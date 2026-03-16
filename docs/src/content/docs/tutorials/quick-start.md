---
title: Quick Start
description: Get started with AlgoKit TypeScript AVM Debugging Utilities.
---

## Install

This library can be installed from NPM using your favourite npm client, e.g.:

```bash
npm install @algorandfoundation/algokit-utils @algorandfoundation/algokit-utils-debug
```

## Usage

Import the package and activate `algokit-utils-ts` debugging:

```typescript
import { Config } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'

Config.configure({
  debug: true,
  traceAll: true, // optional, defaults to false, ignoring simulate on successful transactions.
  projectRoot: '/path/to/project/root', // if not set, the package will try to find the project root automatically
  traceBufferSizeMb: 256, // optional, defaults to 256 MB. Controls when oldest trace files are removed.
  maxSearchDepth: 10, // optional, defaults to 10. Max depth to search for .algokit.toml config file.
})
registerDebugEventHandlers() // IMPORTANT: must be called before any transactions are submitted.
```

> [!NOTE]
> [Python's version of algokit-utils](https://github.com/algorandfoundation/algokit-utils-py) contains the same functionality without requiring a separate package install.
