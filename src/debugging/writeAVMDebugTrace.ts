import { AVMTracesEventData } from '@algorandfoundation/algokit-utils'
import { SimulateResponse } from 'algosdk/dist/types/client/v2/algod/models/types'
import { DEBUG_TRACES_DIR } from '../constants'
import { createDirForFilePathIfNotExists, formatTimestampUTC, getProjectRoot, joinPaths, writeToFile } from '../utils'

type TxnTypeCount = {
  type: string
  count: number
}

/**
 * Removes old trace files when total size exceeds buffer limit
 */
export async function cleanupOldFiles(bufferSizeMb: number, outputRootDir: string): Promise<void> {
  const fs = await import('fs')
  const path = await import('path')

  let totalSize = (
    await Promise.all(
      (await fs.promises.readdir(outputRootDir)).map(async (file) => (await fs.promises.stat(path.join(outputRootDir, file))).size),
    )
  ).reduce((a, b) => a + b, 0)

  if (totalSize > bufferSizeMb * 1024 * 1024) {
    const files = await fs.promises.readdir(outputRootDir)
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const stats = await fs.promises.stat(path.join(outputRootDir, file))
        return { file, mtime: stats.mtime, size: stats.size }
      }),
    )

    // Sort by modification time (oldest first)
    fileStats.sort((a, b) => a.mtime.getTime() - b.mtime.getTime())

    // Remove oldest files until we're under the buffer size
    while (totalSize > bufferSizeMb * 1024 * 1024 && fileStats.length > 0) {
      const oldestFile = fileStats.shift()!
      totalSize -= oldestFile.size
      await fs.promises.unlink(path.join(outputRootDir, oldestFile.file))
    }
  }
}

/**
 * Generates a descriptive filename for a debug trace based on transaction types
 */
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
export async function writeAVMDebugTrace(input: AVMTracesEventData, bufferSizeMb: number): Promise<void> {
  try {
    const simulateResponse = input.simulateResponse
    const projectRoot = await getProjectRoot()
    const timestamp = formatTimestampUTC(new Date())
    const outputRootDir = joinPaths(projectRoot, DEBUG_TRACES_DIR)
    const filename = generateDebugTraceFilename(simulateResponse, timestamp)
    const outputFilePath = joinPaths(outputRootDir, filename)

    await createDirForFilePathIfNotExists(outputFilePath)
    await cleanupOldFiles(bufferSizeMb, outputRootDir)

    await writeToFile(outputFilePath, JSON.stringify(simulateResponse.get_obj_for_encoding(), null, 2))
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    throw err
  }
}
