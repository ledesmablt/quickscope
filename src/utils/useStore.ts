import storage, { LocalStorage } from './storage'

import create from 'zustand'
import _ from 'lodash'
import { FILTER_LIST_OPTIONS } from 'src/constants'

const initDefaults: LocalStorage = {
  myList: '',
  externalRequestsConfig: [],
  filterOptions_includeLists: FILTER_LIST_OPTIONS,
  searchDebounce: 150
}

export interface Store extends LocalStorage {
  init: () => Promise<void>
  initialized: boolean
}

const useStore = create<Store>((set) => {
  return {
    init: async () => {
      // load up local storage
      const storageContent: LocalStorage = _.pickBy(
        (await storage.get()) || {},
        (_v, k) => {
          return Object.keys(initDefaults).includes(k)
        }
      )
      const changes: LocalStorage = {}
      for (const [key, value] of Object.entries(initDefaults)) {
        // fill in missing fields if any
        if (_.isNil(storageContent[key])) {
          storageContent[key] = value
          changes[key] = value
        }
      }
      // update local storage if any defaults were set
      if (Object.keys(changes).length) {
        await storage.set(changes)
      }
      // update store
      set(storageContent)
      set({
        initialized: true
      })
    },
    initialized: false
  }
})

export default useStore
