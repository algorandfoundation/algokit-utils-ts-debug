import { Config } from '@algorandfoundation/algokit-utils'
import { DEFAULT_MAX_SEARCH_DEPTH } from '../constants'
import { isNode } from '../utils'

/**
 * Sets the AlgoKit project root directory by searching for the `.algokit.toml` file.
 *
 * @param params - The parameters for setting the project root.
 * @param params.maxSearchDepth - The maximum depth to search for the `.algokit.toml` file.
 *
 * @throws Will throw an error if called outside of a Node.js environment.
 */
export async function setAlgoKitProjectRoot(params: { maxSearchDepth: number }): Promise<void> {
  if (!isNode()) {
    throw new Error('`configureProjectRoot` can only be called in Node.js environment.')
  }

  const fs = await import('fs')
  const path = await import('path')

  let currentPath = process.cwd()
  const maxDepth = params.maxSearchDepth ?? DEFAULT_MAX_SEARCH_DEPTH
  for (let i = 0; i < maxDepth; i++) {
    if (fs.existsSync(`${currentPath}/.algokit.toml`)) {
      Config.configure({ projectRoot: currentPath })
      break
    }
    currentPath = path.dirname(currentPath)
  }
}
