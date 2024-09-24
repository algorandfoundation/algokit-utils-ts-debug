import { Config } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { describe, expect, test } from '@jest/globals'
import algosdk from 'algosdk'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { registerNodeDebugHandlers } from '../index'

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
    registerNodeDebugHandlers()
    return localnet.beforeEach()
  })

  test(
    'build teal sourceMaps',
    async () => {
      const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'cwd'))

      const approval = `
#pragma version 9
int 1
`
      const clear = `
#pragma version 9
int 1
`
      const compiledApproval = await localnet.context.algorand.client.algod.compile(approval).sourcemap(true).do()
      const compiledClear = await localnet.context.algorand.client.algod.compile(clear).sourcemap(true).do()

      await Config.events.emitAsync('persistSourceMaps', {
        sources: [
          {
            compiledTeal: {
              teal: approval,
              compiled: compiledApproval.result,
              compiledHash: compiledApproval.hash,
              compiledBase64ToBytes: new Uint8Array(Buffer.from(compiledApproval.result, 'base64')),
              sourceMap: new algosdk.SourceMap(compiledApproval['sourcemap']),
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
              sourceMap: new algosdk.SourceMap(compiledClear['sourcemap']),
            },
            appName: 'cool_app',
            fileName: 'clear',
          },
        ],
        projectRoot: cwd,
        algod: localnet.context.algorand.client.algod,
      })

      const rootPath = path.join(cwd, '.algokit', 'sources')
      const sourcemapFilePath = path.join(rootPath, 'sources.avm.json')
      const appOutputPath = path.join(rootPath, 'cool_app')

      expect(await fileExists(sourcemapFilePath)).toBeFalsy()
      expect(await fileExists(path.join(appOutputPath, 'approval.teal'))).toBeTruthy()
      expect(await fileExists(path.join(appOutputPath, 'approval.teal.tok.map'))).toBeTruthy()
      expect(await fileExists(path.join(appOutputPath, 'clear.teal'))).toBeTruthy()
      expect(await fileExists(path.join(appOutputPath, 'clear.teal.tok.map'))).toBeTruthy()
    },
    timeout,
  )
})
