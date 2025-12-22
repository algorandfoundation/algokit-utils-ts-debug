import { Config, EventType, TealSourcesDebugEventData } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import * as fsSync from 'fs'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { beforeAll, describe, expect, test, vi } from 'vitest'
import { registerDebugEventHandlers } from '../index'

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

describe('persistSourceMaps tests', () => {
  const localnet = algorandFixture()
  const timeout = 10e6

  beforeAll(async () => {
    registerDebugEventHandlers()
    return localnet.newScope()
  })

  test(
    'build teal sourceMaps',
    async () => {
      const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'cwd'))
      await fs.writeFile(path.join(cwd, '.algokit.toml'), '')
      vi.spyOn(process, 'cwd').mockReturnValue(cwd)

      const approval = `
#pragma version 9
int 1
`
      const clear = `
#pragma version 9
int 1
`
      const compiledApproval = await localnet.context.algorand.client.algod.tealCompile(approval, { sourcemap: true })
      const compiledClear = await localnet.context.algorand.client.algod.tealCompile(clear, { sourcemap: true })

      await Config.events.emitAsync(EventType.AppCompiled, {
        sources: [
          {
            compiledTeal: {
              teal: approval,
              compiled: compiledApproval.result,
              compiledHash: compiledApproval.hash,
              compiledBase64ToBytes: new Uint8Array(Buffer.from(compiledApproval.result, 'base64')),
              sourceMap: compiledApproval.sourcemap!,
            },
            appName: 'cool_app',
            fileName: 'approval',
          },
          {
            compiledTeal: {
              teal: clear,
              compiled: compiledClear.result,
              compiledHash: compiledClear.hash,
              compiledBase64ToBytes: new Uint8Array(Buffer.from(compiledClear.result, 'base64')),
              sourceMap: compiledClear.sourcemap!,
            },
            appName: 'cool_app',
            fileName: 'clear',
          },
        ],
      } satisfies TealSourcesDebugEventData)

      const rootPath = path.join(cwd, '.algokit', 'sources')
      const sourcemapFilePath = path.join(rootPath, 'sources.avm.json')
      const appOutputPath = path.join(rootPath, 'cool_app')

      // wait until folder exists or timeout after 10 seconds
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (
            fsSync.existsSync(path.join(appOutputPath, 'approval.teal')) &&
            fsSync.existsSync(path.join(appOutputPath, 'approval.teal.map'))
          ) {
            clearInterval(interval)
            resolve(true)
          }
        }, 100)
      })

      expect(await fileExists(sourcemapFilePath)).toBeFalsy()
      expect(await fileExists(path.join(appOutputPath, 'approval.teal'))).toBeTruthy()
      expect(await fileExists(path.join(appOutputPath, 'approval.teal.map'))).toBeTruthy()
      expect(await fileExists(path.join(appOutputPath, 'clear.teal'))).toBeTruthy()
      expect(await fileExists(path.join(appOutputPath, 'clear.teal.map'))).toBeTruthy()

      vi.restoreAllMocks()
    },
    timeout,
  )
})
