// in case supporting different browsers, can use this as an "API"

import { SearchEntry } from 'src/types'
import { CallExternalOptions } from './callExternal'

export interface LocalStorage {
  searchText?: string
  asyncSearchList?: string[]
  myList?: SearchEntry[]
  'options.filter.excludeList'?: Record<string, boolean>
  'options.list.callExternalConfigs'?: CallExternalOptions[]
}

export default {
  set: async (body: Partial<LocalStorage>): Promise<void> => {
    await chrome.storage.local.set(body)
  },
  get: async <T = any>(key: keyof LocalStorage): Promise<T> => {
    const result = await chrome.storage.local.get(key)
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
