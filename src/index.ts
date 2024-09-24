/* eslint-disable @typescript-eslint/no-explicit-any */
import { Config } from '@algorandfoundation/algokit-utils'
import { persistSourceMaps, setAlgoKitProjectRoot, simulateAndPersistResponse } from './debugging'
import {
  AVMDebuggerSourceMap,
  AVMDebuggerSourceMapEntry,
  PersistSourceMapInput,
  PersistSourceMapsParams,
  SimulateAndPersistResponseParams,
} from './types/debugging'

/**
 * Registers event handlers for various debugging events.
 *
 * This function sets up listeners for the following events:
 * - 'persistSourceMaps': Calls the `persistSourceMaps` function with the provided data.
 * - 'simulateAndPersistResponse': Calls the `simulateAndPersistResponse` function with the provided data.
 * - 'configureProjectRoot': Calls the `setAlgoKitProjectRoot` function with the provided data.
 *
 * @returns {void}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registerNodeDebugHandlers = (): void => {
  Config.events.on('persistSourceMaps', async (data: any) => {
    await persistSourceMaps(data)
  })
  Config.events.on('simulateAndPersistResponse', async (data: any) => {
    await simulateAndPersistResponse(data)
  })
  Config.events.on('configureProjectRoot', async (data: any) => {
    await setAlgoKitProjectRoot(data)
  })
}

export {
  AVMDebuggerSourceMap,
  AVMDebuggerSourceMapEntry,
  PersistSourceMapInput,
  persistSourceMaps,
  registerNodeDebugHandlers,
  setAlgoKitProjectRoot,
  simulateAndPersistResponse,
}

export type { PersistSourceMapsParams, SimulateAndPersistResponseParams }
