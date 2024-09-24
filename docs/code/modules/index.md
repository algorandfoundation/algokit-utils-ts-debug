[@algorandfoundation/algokit-utils-debug](../README.md) / index

# Module: index

## Table of contents

### References

- [AVMDebuggerSourceMap](index.md#avmdebuggersourcemap)
- [AVMDebuggerSourceMapEntry](index.md#avmdebuggersourcemapentry)
- [PersistSourceMapInput](index.md#persistsourcemapinput)
- [PersistSourceMapsParams](index.md#persistsourcemapsparams)
- [SimulateAndPersistResponseParams](index.md#simulateandpersistresponseparams)

### Functions

- [persistSourceMaps](index.md#persistsourcemaps)
- [registerNodeDebugHandlers](index.md#registernodedebughandlers)
- [setAlgoKitProjectRoot](index.md#setalgokitprojectroot)
- [simulateAndPersistResponse](index.md#simulateandpersistresponse)

## References

### AVMDebuggerSourceMap

Re-exports [AVMDebuggerSourceMap](../classes/types_debugging.AVMDebuggerSourceMap.md)

___

### AVMDebuggerSourceMapEntry

Re-exports [AVMDebuggerSourceMapEntry](../classes/types_debugging.AVMDebuggerSourceMapEntry.md)

___

### PersistSourceMapInput

Re-exports [PersistSourceMapInput](../classes/types_debugging.PersistSourceMapInput.md)

___

### PersistSourceMapsParams

Re-exports [PersistSourceMapsParams](../interfaces/types_debugging.PersistSourceMapsParams.md)

___

### SimulateAndPersistResponseParams

Re-exports [SimulateAndPersistResponseParams](../interfaces/types_debugging.SimulateAndPersistResponseParams.md)

## Functions

### persistSourceMaps

▸ **persistSourceMaps**(`params`): `Promise`\<`void`\>

Persists the source maps for the given sources.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`PersistSourceMapsParams`](../interfaces/types_debugging.PersistSourceMapsParams.md) | The parameters to define the source maps to persist. |

#### Returns

`Promise`\<`void`\>

A promise that resolves when the source maps have been persisted.

**`Throws`**

Will throw an error if not running in a Node.js environment.

#### Defined in

[debugging/persistSourceMaps.ts:15](https://github.com/algorandfoundation/algokit-utils-ts-debug/blob/main/src/debugging/persistSourceMaps.ts#L15)

___

### registerNodeDebugHandlers

▸ **registerNodeDebugHandlers**(): `void`

Registers event handlers for various debugging events.

This function sets up listeners for the following events:
- 'persistSourceMaps': Calls the `persistSourceMaps` function with the provided data.
- 'simulateAndPersistResponse': Calls the `simulateAndPersistResponse` function with the provided data.
- 'configureProjectRoot': Calls the `setAlgoKitProjectRoot` function with the provided data.

#### Returns

`void`

#### Defined in

[index.ts:23](https://github.com/algorandfoundation/algokit-utils-ts-debug/blob/main/src/index.ts#L23)

___

### setAlgoKitProjectRoot

▸ **setAlgoKitProjectRoot**(`params`): `Promise`\<`void`\>

Sets the AlgoKit project root directory by searching for the `.algokit.toml` file.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The parameters for setting the project root. |
| `params.maxSearchDepth` | `number` | The maximum depth to search for the `.algokit.toml` file. |

#### Returns

`Promise`\<`void`\>

**`Throws`**

Will throw an error if called outside of a Node.js environment.

#### Defined in

[debugging/setAlgoKitProjectRoot.ts:13](https://github.com/algorandfoundation/algokit-utils-ts-debug/blob/main/src/debugging/setAlgoKitProjectRoot.ts#L13)

___

### simulateAndPersistResponse

▸ **simulateAndPersistResponse**(`param`): `Promise`\<`SimulateResponse`\>

Simulates the atomic transactions using the provided `AtomicTransactionComposer` object and `Algodv2` object,
and persists the simulation response to an AlgoKit AVM Debugger compliant JSON file.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `param` | [`SimulateAndPersistResponseParams`](../interfaces/types_debugging.SimulateAndPersistResponseParams.md) | The parameters to control the simulation and persistence of Atomic Transaction Composer call and response. |

#### Returns

`Promise`\<`SimulateResponse`\>

The simulation result, which includes various details about how the transactions would be processed.

**`Example`**

```ts
const atc = new AtomicTransactionComposer();
const algod = new algosdk.Algodv2(token, server, port);
const projectRoot = '/path/to/project';
const bufferSizeMb = 10;

const result = await simulateAndPersistResponse({ atc, projectRoot, algod, bufferSizeMb });
console.log(result);
```

#### Defined in

[debugging/simulateAndPersistResponse.ts:65](https://github.com/algorandfoundation/algokit-utils-ts-debug/blob/main/src/debugging/simulateAndPersistResponse.ts#L65)
