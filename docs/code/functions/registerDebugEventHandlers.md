[**@algorandfoundation/algokit-utils-debug**](../README.md) • **Docs**

***

[@algorandfoundation/algokit-utils-debug](../README.md) / registerDebugEventHandlers

# Function: registerDebugEventHandlers()

> **registerDebugEventHandlers**(): `void`

Registers event handlers for debugging events in Algorand development.

This function sets up handlers for the following events:
- 'TxnGroupSimulated': Calls the `writeAVMDebugTrace` function to generate and persist an AVM debug trace.
- 'AppCompiled': Calls the `writeTealDebugSourceMaps` function to generate and persist TEAL source maps.

These handlers help in debugging Algorand smart contracts by providing detailed traces and source maps.

## Returns

`void`

## Defined in

[index.ts:17](https://github.com/algorandfoundation/algokit-utils-ts-debug/blob/main/src/index.ts#L17)