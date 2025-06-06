[**@algorandfoundation/algokit-utils-debug**](../README.md)

***

[@algorandfoundation/algokit-utils-debug](../README.md) / writeAVMDebugTrace

# Function: writeAVMDebugTrace()

> **writeAVMDebugTrace**(`input`, `bufferSizeMb`): `Promise`\<`void`\>

Defined in: [debugging/writeAVMDebugTrace.ts:85](https://github.com/algorandfoundation/algokit-utils-ts-debug/blob/main/src/debugging/writeAVMDebugTrace.ts#L85)

Generates an AVM debug trace from the provided simulation response and persists it to a file.

## Parameters

### input

`AVMTracesEventData`

The AVMTracesEventData containing the simulation response and other relevant information.

### bufferSizeMb

`number`

## Returns

`Promise`\<`void`\>

An object containing the output file path and the trace content as a string.

## Example

```ts
const eventData: AVMTracesEventData = {
  simulateResponse: // ... simulation response object
};

const result = await writeAVMDebugTrace(eventData);
console.log(`Debug trace saved to: ${result.outputPath}`);
console.log(`Trace content: ${result.traceContent}`);
```
