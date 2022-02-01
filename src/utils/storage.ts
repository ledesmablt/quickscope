// in case supporting different browsers, can use this as an "API"

import { CallExternalOptions } from './callExternal'

export interface LocalStorage {
  myList?: string
  'options.filter.excludeList'?: Record<string, boolean>
  'options.list.callExternalConfigs'?: CallExternalOptions[]
}

export default {
  set: async (body: Partial<LocalStorage>): Promise<void> => {
    await chrome.storage.local.set(body)
  },
  get: async (key?: keyof LocalStorage): Promise<any> => {
    const result = await chrome.storage.local.get(key)
    if (!key) {
      return result
    }
    return result?.[key]
  },
  remove: async (
    key: keyof LocalStorage | (keyof LocalStorage)[]
  ): Promise<void> => {
    await chrome.storage.local.remove(key)
  },
  clear: async (): Promise<void> => {
    await chrome.storage.local.clear()
  }
}
