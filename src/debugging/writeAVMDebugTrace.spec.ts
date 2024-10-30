import { Config, EventType, performAtomicTransactionComposerSimulate } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { describe, expect, test } from '@jest/globals'
import algosdk, { makeEmptyTransactionSigner } from 'algosdk'
import { SimulateResponse } from 'algosdk/dist/types/client/v2/algod/models/types'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { DEBUG_TRACES_DIR } from '../constants'
import { registerDebugEventHandlers } from '../index'
import { generateDebugTraceFilename } from './writeAVMDebugTrace'

describe('writeAVMDebugTrace tests', () => {
  const localnet = algorandFixture()

  beforeAll(async () => {
    registerDebugEventHandlers()
    return localnet.beforeEach()
  })

  test('respond to algokit-utils txn group simulated event', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'cwd'))
    await fs.writeFile(path.join(cwd, '.algokit.toml'), '')

    jest.spyOn(process, 'cwd').mockReturnValue(cwd)
    const mockAtc = new algosdk.AtomicTransactionComposer()
    const mockPay = await localnet.context.algorand.createTransaction.payment({
      sender: 'BOB4H2EFAL3OKDEE2FATYKJRQZSKGLXM7KB6CKSSIBENJCO2SVXDLZ6IBI',
      receiver: 'BOB4H2EFAL3OKDEE2FATYKJRQZSKGLXM7KB6CKSSIBENJCO2SVXDLZ6IBI',
      amount: (0).algo(),
    })
    mockAtc.addTransaction({ txn: mockPay, signer: makeEmptyTransactionSigner() })
    const mockAlgod = localnet.context.algorand.client.algod

    const simulateResponse = await performAtomicTransactionComposerSimulate(mockAtc, mockAlgod)
    await Config.events.emitAsync(EventType.TxnGroupSimulated, {
      simulateResponse,
    })

    const debugTracesDir = path.join(cwd, DEBUG_TRACES_DIR)
    const files = await fs.readdir(debugTracesDir)
    expect(files.length).toBeGreaterThan(0)
    expect(files[0]).toMatch(/\.trace\.avm\.json$/)
    const traceContent = JSON.parse(await fs.readFile(path.join(debugTracesDir, files[0]), 'utf8'))
    expect(traceContent['txn-groups'][0]['txn-results'][0]['txn-result'].txn.txn.snd).toBe('C4PD6IUC9uUMhNFBPCkxhmSjLuz6g+EqUkBI1InalW4=')

    jest.restoreAllMocks()
  })
})

describe('generateDebugTraceFilename', () => {
  const TEST_CASES: Array<[string, object, string]> = [
    [
      'single payment transaction',
      {
        lastRound: 1000,
        txnGroups: [
          {
            txnResults: [{ txnResult: { txn: { txn: { type: 'pay' } } } }],
          },
        ],
      },
      '1pay',
    ],
    [
      'multiple transaction types',
      {
        lastRound: 1000,
        txnGroups: [
          {
            txnResults: [
              { txnResult: { txn: { txn: { type: 'pay' } } } },
              { txnResult: { txn: { txn: { type: 'pay' } } } },
              { txnResult: { txn: { txn: { type: 'axfer' } } } },
              { txnResult: { txn: { txn: { type: 'appl' } } } },
              { txnResult: { txn: { txn: { type: 'appl' } } } },
              { txnResult: { txn: { txn: { type: 'appl' } } } },
            ],
          },
        ],
      },
      '2pay_1axfer_3appl',
    ],
  ]

  test.each(TEST_CASES)('%s', (testName, mockResponse, expectedPattern) => {
    const timestamp = '20230101_120000'
    const filename = generateDebugTraceFilename(mockResponse as SimulateResponse, timestamp)
    expect(filename).toBe(`${timestamp}_lr${(mockResponse as SimulateResponse).lastRound}_${expectedPattern}.trace.avm.json`)
  })
})
