import { AVMTracesEventData, Config, EventType } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { DEBUG_TRACES_DIR } from '../constants'
import { registerDebugEventHandlers } from '../index'
import { cleanupOldFiles, generateDebugTraceFilename } from './writeAVMDebugTrace'

describe('writeAVMDebugTrace tests', () => {
  const localnet = algorandFixture()

  beforeAll(async () => {
    registerDebugEventHandlers()
    return localnet.newScope()
  })

  test('respond to algokit-utils txn group simulated event', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'cwd'))
    await fs.writeFile(path.join(cwd, '.algokit.toml'), '')

    vi.spyOn(process, 'cwd').mockReturnValue(cwd)

    const simulateResult = await localnet.context.algorand
      .newGroup()
      .addPayment({
        sender: 'BOB4H2EFAL3OKDEE2FATYKJRQZSKGLXM7KB6CKSSIBENJCO2SVXDLZ6IBI',
        receiver: 'BOB4H2EFAL3OKDEE2FATYKJRQZSKGLXM7KB6CKSSIBENJCO2SVXDLZ6IBI',
        amount: (0).algo(),
      })
      .simulate({
        allowEmptySignatures: true,
        resultOnFailure: true,
      })

    await Config.events.emitAsync(EventType.TxnGroupSimulated, {
      simulateResponse: simulateResult.simulateResponse,
    })

    const debugTracesDir = path.join(cwd, DEBUG_TRACES_DIR)
    const files = await fs.readdir(debugTracesDir)
    expect(files.length).toBeGreaterThan(0)
    expect(files[0]).toMatch(/\.trace\.avm\.json$/)
    const traceContent = JSON.parse(await fs.readFile(path.join(debugTracesDir, files[0]), 'utf8'))
    expect(traceContent['txn-groups'][0]['txn-results'][0]['txn-result'].txn.txn.snd).toBe(
      'BOB4H2EFAL3OKDEE2FATYKJRQZSKGLXM7KB6CKSSIBENJCO2SVXDLZ6IBI',
    )

    vi.restoreAllMocks()
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
    const filename = generateDebugTraceFilename(mockResponse as AVMTracesEventData['simulateResponse'], timestamp)
    expect(filename).toBe(
      `${timestamp}_lr${(mockResponse as AVMTracesEventData['simulateResponse']).lastRound}_${expectedPattern}.trace.avm.json`,
    )
  })
})

describe('cleanupOldFiles', () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'debug-traces-'))
  })

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true })
  })

  test('removes oldest files when buffer size is exceeded', async () => {
    // Create test files with different timestamps and sizes
    const testFiles = [
      { name: 'old.json', content: 'a'.repeat(1024 * 1024), mtime: new Date('2023-01-01') },
      { name: 'newer.json', content: 'b'.repeat(1024 * 1024), mtime: new Date('2023-01-02') },
      { name: 'newest.json', content: 'c'.repeat(1024 * 1024), mtime: new Date('2023-01-03') },
    ]

    // Create files with specific timestamps
    for (const file of testFiles) {
      const filePath = path.join(tempDir, file.name)
      await fs.writeFile(filePath, file.content)
      await fs.utimes(filePath, file.mtime, file.mtime)
    }

    // Set buffer size to 2MB (should remove oldest file)
    await cleanupOldFiles(2, tempDir)

    // Check remaining files
    const remainingFiles = await fs.readdir(tempDir)
    expect(remainingFiles).toHaveLength(2)
    expect(remainingFiles).toContain('newer.json')
    expect(remainingFiles).toContain('newest.json')
    expect(remainingFiles).not.toContain('old.json')
  })

  test('does nothing when total size is within buffer limit', async () => {
    const content = 'a'.repeat(512 * 1024) // 512KB
    await fs.writeFile(path.join(tempDir, 'file1.json'), content)
    await fs.writeFile(path.join(tempDir, 'file2.json'), content)

    // Set buffer size to 2MB (files total 1MB, should not remove anything)
    await cleanupOldFiles(2, tempDir)

    const remainingFiles = await fs.readdir(tempDir)
    expect(remainingFiles).toHaveLength(2)
  })
})
