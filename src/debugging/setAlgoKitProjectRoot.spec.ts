import { Config } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { describe, expect, jest, test } from '@jest/globals'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { registerNodeDebugHandlers } from '../index'

describe('setAlgoKitProjectRoot tests', () => {
  const localnet = algorandFixture()

  beforeAll(async () => {
    registerNodeDebugHandlers()
    return localnet.beforeEach()
  })

  test('configure project root', async () => {
    const mockConfigureSpy = jest.spyOn(Config, 'configure')
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'cwd'))

    jest.spyOn(process, 'cwd').mockReturnValue(cwd)
    await fs.writeFile(path.join(cwd, '.algokit.toml'), '')

    await Config.events.emitAsync('configureProjectRoot', { maxSearchDepth: 1 })

    expect(mockConfigureSpy).toHaveBeenCalledWith({ projectRoot: expect.any(String) })
    jest.restoreAllMocks()
  })
})
