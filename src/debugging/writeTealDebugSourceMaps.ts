import {
  ALGOKIT_DIR,
  SOURCES_DIR,
  TEAL_FILE_EXT,
  TEAL_SOURCEMAP_EXT,
  TealSourceDebugEventData,
  TealSourcesDebugEventData,
} from '@algorandfoundation/algokit-utils/types/debugging'
import { getProjectRoot, writeToFile } from '../utils'

async function writeTealDebugSourceMap(source: TealSourceDebugEventData, projectRoot: string): Promise<void> {
  const path = await import('path')

  if (!source.compiledTeal) {
    throw new Error('No compiled teal found')
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = source.compiledTeal
  const sourceMap = result.sourceMap
  sourceMap.sources = [`${source.fileName}${TEAL_FILE_EXT}`]

  const outputDirPath = path.join(projectRoot, ALGOKIT_DIR, SOURCES_DIR, source.appName)
  const sourceMapOutputPath = path.join(outputDirPath, `${source.fileName}${TEAL_SOURCEMAP_EXT}`)
  const tealOutputPath = path.join(outputDirPath, `${source.fileName}${TEAL_FILE_EXT}`)
  await writeToFile(sourceMapOutputPath, JSON.stringify(sourceMap, null, 2))
  await writeToFile(tealOutputPath, result.teal)
}

/**
 * Generates a source map for the given Teal source code.
 *
 * @param param0 The parameters to define the source map generation.
 * @returns A promise that resolves when the source map has been generated.
 */
export async function writeTealDebugSourceMaps(input: TealSourcesDebugEventData): Promise<void> {
  const sources = input.sources
  const projectRoot = await getProjectRoot()

  try {
    await Promise.all(
      sources.map((source) => {
        writeTealDebugSourceMap(source, projectRoot)
      }),
    )
  } catch (error) {
    const err = error instanceof Error ? error : new Error(JSON.stringify(error, null, 2))
    throw err
  }
}
