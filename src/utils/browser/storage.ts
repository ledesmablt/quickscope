import { CallExternalOptions } from '../callExternal'

export interface LocalStorage {
  myList?: string
  externalRequestsConfig?: CallExternalOptions[]
  includeLists?: string[]
  searchDebounce?: number
}

export default {
  set: async (body: Partial<LocalStorage>): Promise<void> => {
    await browser.storage.local.set(body)
  },
  get: async (key?: keyof LocalStorage): Promise<any> => {
    const result = await browser.storage.local.get(key)
    if (!key) {
      return result
    }
    return result?.[key]
  },
  remove: async (
    key: keyof LocalStorage | (keyof LocalStorage)[]
  ): Promise<void> => {
    await browser.storage.local.remove(key)
  },
  clear: async (): Promise<void> => {
    await browser.storage.local.clear()
  }
}
