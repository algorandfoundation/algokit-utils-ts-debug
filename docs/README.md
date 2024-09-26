# AlgoKit TypeScript AVM Debugging Utilities

Debugging utilities can be used to simplify gathering artifacts to be used with [AlgoKit AVM Debugger](https://github.com/algorandfoundation/algokit-avm-vscode-debugger) in non algokit compliant projects.

## Install

This library can be installed from NPM using your favourite npm client, e.g.:

```
npm install @algorandfoundation/algokit-utils-debug
```

Then to import it and activate `utils-ts` debugging:

```typescript
import { Config } from '@algorandfoundation/algokit-utils'
import { registerDebugHandlers } from '@algorandfoundation/algokit-utils-debug'

Config.configure({
  debug: true,
  traceAll: true, // optional, defaults to ignoring simulate on successfull transactions.
})
registerDebugHandlers() // must be called before any transactions are submitted.
```

##

The following methods are provided:

- `persistSourceMaps`: This method persists the sourcemaps for the given sources as AlgoKit AVM Debugger compliant artifacts. It accepts an array of `PersistSourceMapInput` objects. Each object can either contain `rawTeal`, in which case the function will execute a compile to obtain byte code, or it can accept an object of type `CompiledTeal` provided by algokit, which is used for source codes that have already been compiled and contain the traces. It also accepts the root directory of the project, an `Algodv2` client to perform the compilation, and a boolean indicating whether to include the source files in the output.
- `simulateAndPersistResponse`: This method simulates the atomic transactions using the provided `AtomicTransactionComposer` object and `Algodv2` object, and persists the simulation response to an AlgoKit AVM Debugger compliant JSON file. It accepts the `AtomicTransactionComposer` with transaction(s) loaded, an `Algodv2` client to perform the simulation, the root directory of the project, and the buffer size in megabytes.

To enable debug mode with extra trace persistence for AVM VSCode Debugger, you can configure it as follows:

```ts
import { Config } from '@algorandfoundation/algokit-utils'
Config.configure({
  debug: true,
  traceAll: true, // if ignored, will only trace failed atomic transactions and application client calls
  projectRoot: '/path/to/project/root', // if ignored, will try to find the project root automatically by for 'ALGOKIT_PROJECT_ROOT' environment variable or checking filesystem recursively
})
```

### Trace filename format

The trace files are named in a specific format to provide useful information about the transactions they contain. The format is as follows:

```ts
;`${timestamp}_lr${lastRound}_${transactionTypes}.trace.avm.json`
```

Where:

- `timestamp`: The time when the trace file was created, in ISO 8601 format, with colons and periods removed.
- `lastRound`: The last round when the simulation was performed.
- `transactionTypes`: A string representing the types and counts of transactions in the atomic group. Each transaction type is represented as `${count}#${type}`, and different transaction types are separated by underscores.

For example, a trace file might be named `20220301T123456Z_lr1000_2#pay_1#axfer.trace.avm.json`, indicating that the trace file was created at `2022-03-01T12:34:56Z`, the last round was `1000`, and the atomic group contained 2 payment transactions and 1 asset transfer transaction.
