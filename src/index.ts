/* eslint-disable @typescript-eslint/no-explicit-any */
import { Config } from '@algorandfoundation/algokit-utils'
import { persistSourceMaps, simulateAndPersistResponse } from './debugging'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registerNodeDebugHandlers = () => {
  Config.events.on('persistSourceMaps', async (data: any) => {
    await persistSourceMaps(data)
  })
  Config.events.on('simulateAndPersistResponse', async (data: any) => {
    await simulateAndPersistResponse(data)
  })
}

export { registerNodeDebugHandlers }
