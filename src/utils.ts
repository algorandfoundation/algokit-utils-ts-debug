import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { createHash } from 'crypto' // Import the createHash method from the crypto module
import { ALGOKIT_DIR, SOURCES_DIR, TEAL_FILE_EXT, TEAL_SOURCEMAP_EXT } from './constants'
import { AVMDebuggerSourceMapEntry, CompiledTeal } from './types/debugging'

export const isNode = () => {
  return typeof process !== 'undefined' && process.versions != null && process.versions.node != null
}

export async function writeToFile(filePath: string, content: string): Promise<void> {
  const path = await import('path')
  const fs = await import('fs')

  await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
  await fs.promises.writeFile(filePath, content, 'utf8')
}

export async function buildAVMSourcemap({
  rawTeal,
  compiledTeal,
  appName,
  fileName,
  outputPath,
  algorandClient,
  withSources = true,
}: {
  rawTeal?: string
  compiledTeal?: CompiledTeal
  appName: string
  fileName: string
  outputPath: string
  algorandClient: AlgorandClient
  withSources?: boolean
}): Promise<AVMDebuggerSourceMapEntry> {
  if (!isNode()) {
    throw new Error('`buildAVMSourcemap` can only be called in Node.js environment.')
  }

  if (!rawTeal && !compiledTeal) {
    throw new Error('Either rawTeal or compiledTeal must be provided.')
  }
  const path = await import('path')

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = rawTeal ? await algorandClient.app.compileTeal(rawTeal) : compiledTeal!
  const programHash = createHash('SHA-512/256').update(Buffer.from(result.compiled, 'base64')).digest('base64')
  const sourceMap = result.sourceMap
  sourceMap.sources = withSources ? [`${fileName}${TEAL_FILE_EXT}`] : []

  const outputDirPath = path.join(outputPath, ALGOKIT_DIR, SOURCES_DIR, appName)
  const sourceMapOutputPath = path.join(outputDirPath, `${fileName}${TEAL_SOURCEMAP_EXT}`)
  const tealOutputPath = path.join(outputDirPath, `${fileName}${TEAL_FILE_EXT}`)
  await writeToFile(sourceMapOutputPath, JSON.stringify(sourceMap))

  if (withSources && result) {
    await writeToFile(tealOutputPath, result.teal)
  }

  return new AVMDebuggerSourceMapEntry(sourceMapOutputPath, programHash)
}
