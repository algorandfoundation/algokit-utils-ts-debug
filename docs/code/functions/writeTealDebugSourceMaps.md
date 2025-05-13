[**@algorandfoundation/algokit-utils-debug**](../README.md)

***

[@algorandfoundation/algokit-utils-debug](../README.md) / writeTealDebugSourceMaps

# Function: writeTealDebugSourceMaps()

> **writeTealDebugSourceMaps**(`input`): `Promise`\<`void`\>

Defined in: [debugging/writeTealDebugSourceMaps.ts:38](https://github.com/algorandfoundation/algokit-utils-ts-debug/blob/main/src/debugging/writeTealDebugSourceMaps.ts#L38)

Generates and writes debug source maps for multiple TEAL sources.

## Parameters

### input

`TealSourcesDebugEventData`

An object of type TealSourcesDebugEventData containing an array of TEAL sources.

## Returns

`Promise`\<`void`\>

A promise that resolves when all source maps have been generated and written.

## Throws

Will throw an error if there's an issue during the source map generation or writing process.
