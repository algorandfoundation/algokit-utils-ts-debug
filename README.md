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
import { registerDebugHandlers } from '@algorandfoundation/algokit-utils-debug'

Config.configure({
  debug: true,
  traceAll: true, // optional, defaults to ignoring simulate on successfull transactions.
})
registerDebugHandlers() // must be called before any transactions are submitted.
```

See [usage](./docs/README.md#usage) for more.

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
