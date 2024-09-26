@algorandfoundation/algokit-utils-debug

# @algorandfoundation/algokit-utils-debug

## Table of contents

### Functions

- [registerDebugEventHandlers](README.md#registerdebugeventhandlers)
- [writeAVMDebugTrace](README.md#writeavmdebugtrace)
- [writeTealDebugSourceMaps](README.md#writetealdebugsourcemaps)

## Functions

### registerDebugEventHandlers

▸ **registerDebugEventHandlers**(): `void`

Registers event handlers for debugging events in Algorand development.

This function sets up listeners for the following events:
- 'TxnGroupSimulated': Calls the `writeAVMDebugTrace` function to generate and persist an AVM debug trace.
- 'AppCompiled': Calls the `writeTealDebugSourceMaps` function to generate and persist TEAL source maps.

These handlers help in debugging Algorand smart contracts by providing detailed traces and source maps.

#### Returns

`void`

#### Defined in

[index.ts:17](https://github.com/algorandfoundation/algokit-utils-ts-debug/blob/main/src/index.ts#L17)

___

### writeAVMDebugTrace

▸ **writeAVMDebugTrace**(`input`): `Promise`\<`void`\>

Generates an AVM debug trace from the provided simulation response and persists it to a file.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `AVMTracesEventData` | The AVMTracesEventData containing the simulation response and other relevant information. |

#### Returns

`Promise`\<`void`\>

An object containing the output file path and the trace content as a string.

**`Example`**

```ts
const eventData: AVMTracesEventData = {
  simulateResponse: // ... simulation response object
};

const result = await writeAVMDebugTrace(eventData);
console.log(`Debug trace saved to: ${result.outputPath}`);
console.log(`Trace content: ${result.traceContent}`);
```

#### Defined in

[debugging/writeAVMDebugTrace.ts:20](https://github.com/algorandfoundation/algokit-utils-ts-debug/blob/main/src/debugging/writeAVMDebugTrace.ts#L20)

___

### writeTealDebugSourceMaps

▸ **writeTealDebugSourceMaps**(`input`): `Promise`\<`void`\>

Generates a source map for the given Teal source code.

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TealSourcesDebugEventData` |

#### Returns

`Promise`\<`void`\>

A promise that resolves when the source map has been generated.

#### Defined in

[debugging/writeTealDebugSourceMaps.ts:36](https://github.com/algorandfoundation/algokit-utils-ts-debug/blob/main/src/debugging/writeTealDebugSourceMaps.ts#L36)
