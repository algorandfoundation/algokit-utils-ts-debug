import { persistSourceMaps, simulateAndPersistResponse } from './debugging'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugin = async (config: { registerDebugHandler: (handler: (params: { message: string; data?: any }) => void) => void }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config.registerDebugHandler(async (params: { message: string; data?: any }) => {
    if (params.message === 'persistSourceMaps') {
      await persistSourceMaps(params.data)
    } else if (params.message === 'simulateAndPersistResponse') {
      await simulateAndPersistResponse(params.data)
    }
    // Add more handlers as needed
  })
}

export default plugin
