import { Config } from '@algorandfoundation/algokit-utils'
import { DEFAULT_MAX_SEARCH_DEPTH } from './constants'

export const isNode = () => {
  return typeof process !== 'undefined' && process.versions != null && process.versions.node != null
}

export async function writeToFile(filePath: string, content: string): Promise<void> {
  const path = await import('path')
  const fs = await import('fs')

  await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
  await fs.promises.writeFile(filePath, content, 'utf8')
}

export async function getProjectRoot(): Promise<string> {
  const projectRoot = Config.projectRoot

  if (!projectRoot) {
    const algokitProjectRoot = process.env.ALGOKIT_PROJECT_ROOT
    if (algokitProjectRoot) {
      const fs = await import('fs')
      if (fs.existsSync(algokitProjectRoot)) {
        Config.configure({ projectRoot: algokitProjectRoot })
        return algokitProjectRoot
      }
    }

    const fs = await import('fs')
    const path = await import('path')

    let currentPath = process.cwd()
    for (let i = 0; i < Config.maxSearchDepth ?? DEFAULT_MAX_SEARCH_DEPTH; i++) {
      if (fs.existsSync(`${currentPath}/.algokit.toml`)) {
        Config.configure({ projectRoot: currentPath })
        return currentPath
      }
      currentPath = path.dirname(currentPath)
    }
  }

  if (!projectRoot) {
    throw new Error(
      'No project root found. Please run this command from within a valid AlgoKit project (must contain a .algokit.toml file).',
    )
  }

  return projectRoot
}

export function joinPaths(...parts: string[]): string {
  const separator = typeof process !== 'undefined' && process.platform === 'win32' ? '\\' : '/'
  return parts.join(separator).replace(/\/+/g, separator)
}
