/* eslint-disable @typescript-eslint/no-explicit-any */
import { AVMTracesEventData, Config, TealSourcesDebugEventData } from '@algorandfoundation/algokit-utils'
import { EventType } from '@algorandfoundation/algokit-utils/types/async-event-emitter'
import { writeAVMDebugTrace, writeTealDebugSourceMaps } from './debugging'

/**
 * Registers event handlers for debugging events in Algorand development.
 *
 * This function sets up listeners for the following events:
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
