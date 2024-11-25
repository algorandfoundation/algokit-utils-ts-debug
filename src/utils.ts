import { Config } from '@algorandfoundation/algokit-utils'
import { DEFAULT_MAX_SEARCH_DEPTH } from './constants'

interface ErrnoException extends Error {
  errno?: number
  code?: string
  path?: string
  syscall?: string
}

export const isNode = () => {
  return typeof process !== 'undefined' && process.versions != null && process.versions.node != null
}

export async function writeToFile(filePath: string, content: string): Promise<void> {
  const path = await import('path')
  const fs = await import('fs')

  await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
  await fs.promises.writeFile(filePath, content, 'utf8')
}

export async function createDirForFilePathIfNotExists(filePath: string): Promise<void> {
  const path = await import('path')
  const fs = await import('fs')

  try {
    await fs.promises.access(path.dirname(filePath))
  } catch (error: unknown) {
    const err = error as ErrnoException

    if (err.code === 'ENOENT') {
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
    } else {
      throw err
    }
  }
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
    for (let i = 0; i < (Config.maxSearchDepth || DEFAULT_MAX_SEARCH_DEPTH); i++) {
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
