---
title: Debugging
description: Debug Algorand smart contracts using the AlgoKit AVM VSCode Debugger Extension.
---

This library provides three main functions for debugging Algorand smart contracts:

## `registerDebugEventHandlers`

The primary function users need to call. It sets up listeners for debugging events emitted by `algokit-utils-ts` (see [AsyncEventEmitter](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/docs/capabilities/event-emitter.md) docs for more details). Must be called before submitting transactions and enabling debug mode in the `algokit-utils-ts` config.

## `writeTealDebugSourceMaps`

Generates and persists AlgoKit AVM Debugger-compliant sourcemaps for compiled TEAL sources. Triggered by `AppCompiled` events, it writes `.teal.map` source map files and raw `.teal` files under `{projectRoot}/.algokit/sources/{appName}/`.

## `writeAVMDebugTrace`

Persists an AVM debug trace from an already-simulated response as an AlgoKit AVM Debugger-compliant JSON file. Triggered by `TxnGroupSimulated` events.

## Default artifact folders

- `{ALGOKIT_PROJECT_ROOT}/.algokit/sources/*`: The folder containing the TEAL source maps and raw TEAL files.
- `{ALGOKIT_PROJECT_ROOT}/debug_traces`: The folder containing the AVM debug traces.

> [!NOTE]
> TEAL source maps are suffixed with `.teal.map` (previously `.teal.tok.map` from `algokit-utils-ts` <=v6.x) file extension, while Algorand Python source maps are suffixed with `.puya.map`.

## Trace filename format

The trace files generated are named in a specific format to provide useful information about the transactions they contain. The format is as follows:

```
${timestamp}_lr${lastRound}_${transactionTypes}.trace.avm.json
```

Where:

- `timestamp`: The time when the trace file was created, in `YYYYMMDD_HHMMSS` UTC format.
- `lastRound`: The last round when the simulation was performed.
- `transactionTypes`: A string representing the types and counts of transactions in the atomic group. Each transaction type is represented as `${count}${type}`, and different transaction types are separated by underscores.

For example, a trace file might be named `20220301_123456_lr1000_2pay_1axfer.trace.avm.json`, indicating that the trace file was created at `2022-03-01 12:34:56 UTC`, the last round was `1000`, and the atomic group contained 2 payment transactions and 1 asset transfer transaction.
