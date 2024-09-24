import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { ClientManager } from '@algorandfoundation/algokit-utils/types/client-manager'
import { PersistSourceMapsParams } from '../types/debugging'
import { buildAVMSourcemap, isNode } from '../utils'

/**
 * Persists the source maps for the given sources.
 *
 * @param params - The parameters to define the source maps to persist.
 *
 * @returns A promise that resolves when the source maps have been persisted.
 *
 * @throws Will throw an error if not running in a Node.js environment.
 */
export async function persistSourceMaps(params: PersistSourceMapsParams): Promise<void> {
  if (!isNode()) {
    throw new Error('Sourcemaps can only be persisted in a Node.js environment.')
  }

  try {
    const { sources, projectRoot, withSources, algod } = params

    const algorandClient = algod
      ? AlgorandClient.fromClients({
          algod: algod,
        })
      : AlgorandClient.fromConfig({
          algodConfig: ClientManager.getDefaultLocalNetConfig('algod'),
        })

    await Promise.all(
      sources.map((source) =>
        buildAVMSourcemap({
          rawTeal: source.compiledTeal.teal,
          compiledTeal: source.compiledTeal,
          appName: source.appName,
          fileName: source.fileName,
          outputPath: projectRoot,
          algorandClient,
          withSources,
        }),
      ),
    )
  } catch (error) {
    const err = error instanceof Error ? error : new Error(JSON.stringify(error))
    throw err
  }
}
