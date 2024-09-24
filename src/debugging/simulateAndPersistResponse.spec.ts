import { Config } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { describe, expect, test } from '@jest/globals'
import algosdk, { makeEmptyTransactionSigner } from 'algosdk'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { registerNodeDebugHandlers } from '../index'
import { SimulateAndPersistResponseParams } from '../types/debugging'

describe('simulateAndPersistResponse tests', () => {
  const localnet = algorandFixture()

  beforeAll(async () => {
    registerNodeDebugHandlers()
    return localnet.beforeEach()
  })

  test('simulate and persist response', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'cwd'))
    const mockAtc = new algosdk.AtomicTransactionComposer()
    const mockPay = await localnet.context.algorand.transactions.payment({
      sender: 'BOB4H2EFAL3OKDEE2FATYKJRQZSKGLXM7KB6CKSSIBENJCO2SVXDLZ6IBI',
      receiver: 'BOB4H2EFAL3OKDEE2FATYKJRQZSKGLXM7KB6CKSSIBENJCO2SVXDLZ6IBI',
      amount: (0).algo(),
    })
    mockAtc.addTransaction({ txn: mockPay, signer: makeEmptyTransactionSigner() })
    const mockAlgod = localnet.context.algorand.client.algod

    const params: SimulateAndPersistResponseParams = {
      algod: mockAlgod,
      atc: mockAtc,
      projectRoot: cwd,
      bufferSizeMb: 10,
    }

    await Config.events.emitAsync('simulateAndPersistResponse', params)

    const debugTracesDir = path.join(cwd, 'debug_traces')
    const files = await fs.readdir(debugTracesDir)
    expect(files.length).toBeGreaterThan(0)
    expect(files[0]).toMatch(/\.trace\.avm\.json$/)
    const traceContent = JSON.parse(await fs.readFile(path.join(debugTracesDir, files[0]), 'utf8'))
    expect(traceContent['txn-groups'][0]['txn-results'][0]['txn-result'].txn.txn.snd).toBe('C4PD6IUC9uUMhNFBPCkxhmSjLuz6g+EqUkBI1InalW4=')
  })
})
