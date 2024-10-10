/* eslint-disable @typescript-eslint/no-explicit-any */
import { AVMTracesEventData, Config, EventType, TealSourcesDebugEventData } from '@algorandfoundation/algokit-utils'
import { writeAVMDebugTrace, writeTealDebugSourceMaps } from './debugging'

/**
 * Registers event handlers for debugging events in Algorand development.
 *
 * This function sets up handlers for the following events:
 * - 'TxnGroupSimulated': Calls the `writeAVMDebugTrace` function to generate and persist an AVM debug trace.
 * - 'AppCompiled': Calls the `writeTealDebugSourceMaps` function to generate and persist TEAL source maps.
 *
 * These handlers help in debugging Algorand smart contracts by providing detailed traces and source maps.
 *
 * @returns {void}
 */
const registerDebugEventHandlers = (): void => {
  Config.events.on(EventType.TxnGroupSimulated, async (eventData: AVMTracesEventData) => {
    await writeAVMDebugTrace(eventData)
  })
  Config.events.on(EventType.AppCompiled, async (data: TealSourcesDebugEventData) => {
    await writeTealDebugSourceMaps(data)
  })
}

export { registerDebugEventHandlers, writeAVMDebugTrace, writeTealDebugSourceMaps }
