import { AVMTracesEventData } from '@algorandfoundation/algokit-utils'
import { SimulateResponse } from 'algosdk/dist/types/client/v2/algod/models/types'
import { DEBUG_TRACES_DIR } from '../constants'
import { getProjectRoot, joinPaths, writeToFile } from '../utils'

type TxnTypeCount = {
  type: string
  count: number
}

/**
 * Formats a date to YYYYMMDD_HHMMSS in UTC, equivalent to algokit-utils-py format:
 * datetime.now(tz=timezone.utc).strftime("%Y%m%d_%H%M%S")
 */
export function formatTimestampUTC(date: Date): string {
  // Get UTC components
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Months are zero-based
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')

  // Format the datetime string
  return `${year}${month}${day}_${hours}${minutes}${seconds}`
}

export function generateDebugTraceFilename(simulateResponse: SimulateResponse, timestamp: string): string {
  const txnGroups = simulateResponse.txnGroups
  const txnTypesCount = txnGroups.reduce((acc: Map<string, TxnTypeCount>, txnGroup) => {
    txnGroup.txnResults.forEach(({ txnResult }) => {
      const { type } = txnResult.txn.txn
      if (!acc.has(type)) {
        acc.set(type, { type, count: 0 })
      }
      const entry = acc.get(type)!
      entry.count++
    })
    return acc
  }, new Map())

  const txnTypesStr = Array.from(txnTypesCount.values())
    .map(({ count, type }) => `${count}${type}`)
    .join('_')

  const lastRound = simulateResponse.lastRound
  return `${timestamp}_lr${lastRound}_${txnTypesStr}.trace.avm.json`
}

/**
 * Generates an AVM debug trace from the provided simulation response and persists it to a file.
 *
 * @param input - The AVMTracesEventData containing the simulation response and other relevant information.
 * @returns An object containing the output file path and the trace content as a string.
 *
 * @example
 * const eventData: AVMTracesEventData = {
 *   simulateResponse: // ... simulation response object
 * };
 *
 * const result = await writeAVMDebugTrace(eventData);
 * console.log(`Debug trace saved to: ${result.outputPath}`);
 * console.log(`Trace content: ${result.traceContent}`);
 */
export async function writeAVMDebugTrace(input: AVMTracesEventData): Promise<void> {
  try {
    const simulateResponse = input.simulateResponse
    const projectRoot = await getProjectRoot()
    const timestamp = formatTimestampUTC(new Date())
    const outputRootDir = joinPaths(projectRoot, DEBUG_TRACES_DIR)
    const filename = generateDebugTraceFilename(simulateResponse, timestamp)
    const outputFilePath = joinPaths(outputRootDir, filename)

    await writeToFile(outputFilePath, JSON.stringify(simulateResponse.get_obj_for_encoding(), null, 2))
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    throw err
  }
}
