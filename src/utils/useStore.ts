import storage, { LocalStorage } from './storage'

import create from 'zustand'
import _ from 'lodash'

export interface Store extends LocalStorage {
  init: () => Promise<void>
}

const useStore = create<Store>((set) => {
  return {
    init: async () => {
      const content = await storage.get()
      set(content || {})
    }
  }
})

export default useStore
