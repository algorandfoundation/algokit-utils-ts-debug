import { AVMTracesEventData } from '@algorandfoundation/algokit-utils'
import { DEBUG_TRACES_DIR } from '../constants'
import { getProjectRoot, joinPaths, writeToFile } from '../utils'

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
    const txnGroups = simulateResponse.txnGroups
    const projectRoot = await getProjectRoot()

    const txnTypesCount = txnGroups.reduce((acc: Record<string, number>, txnGroup) => {
      const txnType = txnGroup.txnResults[0].txnResult.txn.txn.type
      acc[txnType] = (acc[txnType] || 0) + 1
      return acc
    }, {})

    const txnTypesStr = Object.entries(txnTypesCount)
      .map(([type, count]) => `${count}#${type}`)
      .join('_')

    const timestamp = new Date().toISOString().replace(/[:.]/g, '')
    const outputRootDir = joinPaths(projectRoot, DEBUG_TRACES_DIR)
    const outputFilePath = joinPaths(outputRootDir, `${timestamp}_${txnTypesStr}.trace.avm.json`)

    await writeToFile(outputFilePath, JSON.stringify(simulateResponse.get_obj_for_encoding(), null, 2))
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    throw err
  }
}
