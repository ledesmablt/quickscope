// in case supporting different browsers, can use this as an "API"

export interface LocalStorage {
  searchText?: string
}

export default {
  set: async (body: Partial<LocalStorage>): Promise<void> => {
    await chrome.storage.local.set(body)
  },
  get: async <T>(key: keyof LocalStorage): Promise<T> => {
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
