# AlgoKit TypeScript AVM Debugging Utilities

An optional addon package for [algokit-utils-ts](https://github.com/algorandfoundation/algokit-utils-ts) that provides **node** specific utilities that automatically gather artifacts required for instantiating [AlgoKit AVM VSCode Debugger Extension](https://github.com/algorandfoundation/algokit-avm-vscode-debugger). This project is part of [AlgoKit](https://github.com/algorandfoundation/algokit-cli).

Note: [Python's version of algokit-utils](https://github.com/algorandfoundation/algokit-utils-py) contains the same functionality without requiring a separate package install. Consider using that if you are building your AlgoKit project in Python.

[Install](#install) | [Documentation](docs/code/README.md)

## Install

This library can be installed from NPM using your favourite npm client, e.g.:

```
npm install @algorandfoundation/algokit-utils-debug
```

Then to import it and activate `utils-ts` debugging:

```typescript
import { Config } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'

Config.configure({
  debug: true,
  traceAll: true, // optional, defaults to false, ignoring simulate on successfull transactions.
  projectRoot: '/path/to/project/root', // if not set, this package will try to find the project root automatically using either the 'ALGOKIT_PROJECT_ROOT' environment variable or by searching you project structure
  traceBufferSizeMb: 256, // optional, defaults to 256 megabytes. When the output folder containing debug trace files exceeds the size, oldest files are removed to optimize for storage consumption. This is useful when you are running a long running application and want to keep the trace files for debugging purposes but also be mindful of storage consumption.
  maxSearchDepth: 10, // optional, defaults to 10. The maximum depth to search for an `algokit` config file. By default it will traverse at most `10` folders searching for `.algokit.toml` file which will be used to determine the algokit compliant project root path. Ignored if `projectRoot` is provided directly or via `ALGOKIT_PROJECT_ROOT` environment variable.
})
registerDebugEventHandlers() // IMPORTANT: must be called before any transactions are submitted.
```

See [code documentation](./docs/code/README.md) for more details.

## Overview

This library provides three main functions for debugging Algorand smart contracts:

1. `registerDebugEventHandlers`: The primary function users need to call. It sets up listeners for debugging events emitted by `algokit-utils-ts` (see [AsyncEventEmitter](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/docs/capabilities/event-emitter.md) docs for more details). Must be called before submitting transactions and enabling debug mode in the `algokit-utils-ts` config.

2. `writeTealDebugSourceMaps`: Generates and persists AlgoKit AVM Debugger-compliant sourcemaps. It processes an array of `PersistSourceMapInput` objects, which can contain either raw TEAL or pre-compiled TEAL from algokit.

3. `writeAVMDebugTrace`: Simulates atomic transactions and saves the simulation response as an AlgoKit AVM Debugger-compliant JSON file. It uses the provided `AtomicTransactionComposer` and `Algodv2` client for simulation.

### Default artifact folders

- `{ALGOKIT_PROJECT_ROOT}/.algokit/sources/*`: The folder containing the TEAL source maps and raw TEAL files.
- `{ALGOKIT_PROJECT_ROOT}/debug_traces`: The folder containing the AVM debug traces.

> Note, TEAL source maps are suffixed with `.teal.map` (previously `.teal.tok.map` from `algokit-utils-ts` <=v6.x) file extension, while Algorand Python source maps are suffixed with `.puya.map`.

### Trace filename format

The trace files generated are named in a specific format to provide useful information about the transactions they contain. The format is as follows:

```ts
;`${timestamp}_lr${lastRound}_${transactionTypes}.trace.avm.json`
```

Where:

- `timestamp`: The time when the trace file was created, in ISO 8601 format, with colons and periods removed.
- `lastRound`: The last round when the simulation was performed.
- `transactionTypes`: A string representing the types and counts of transactions in the atomic group. Each transaction type is represented as `${count}${type}`, and different transaction types are separated by underscores.

For example, a trace file might be named `20220301T123456Z_lr1000_2pay_1axfer.trace.avm.json`, indicating that the trace file was created at `2022-03-01T12:34:56Z`, the last round was `1000`, and the atomic group contained 2 payment transactions and 1 asset transfer transaction.

## Guiding principles

This library follows the [Guiding Principles of AlgoKit](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/algokit.md#guiding-principles).

## Contributing

This is an open source project managed by the Algorand Foundation. See the [AlgoKit contributing page](https://github.com/algorandfoundation/algokit-cli/blob/main/CONTRIBUTING.md) to learn about making improvements.

To successfully run the tests in this repository you need to be running LocalNet via [AlgoKit](https://github.com/algorandfoundation/algokit-cli) and also have package dependencies and `.env.template` copied to `.env` (both of which `algokit bootstrap all` can do for you):

```
algokit bootstrap all
algokit localnet start
```

To run tests you can use VS Code, or:

```
npm run test
```
