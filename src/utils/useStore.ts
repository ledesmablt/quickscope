import storage, { LocalStorage } from './storage'

import create from 'zustand'
import _ from 'lodash'
import { FILTER_LIST_DEFAULT_CHECKED } from 'src/constants'
import permissions from './permissions'

export const defaults: Required<LocalStorage> = {
  myList: '',
  externalRequestsConfig: [],
  filterOptions_includeLists: FILTER_LIST_DEFAULT_CHECKED,
  searchDebounce: 150
}

export interface Store extends LocalStorage {
  initialized: boolean
  permissions: string[]
  requestPermissions: (permissions: string[]) => Promise<boolean>
  init: () => Promise<Omit<Store, 'init' | 'requestPermissions'>>
}

const useStore = create<Store>((set) => {
  return {
    initialized: false,
    permissions: [],
    requestPermissions: async (scopes) => {
      const granted = await permissions.request(scopes)
      if (granted) {
        const allPermissions = await permissions.getAll()
        set({
          permissions: allPermissions
        })
      }
      return granted
    },
    init: async () => {
      // load up permissions
      const allPermissions = await permissions.getAll()

      // load up local storage
      const storageContent: LocalStorage = _.pickBy(
        (await storage.get()) || {},
        (_v, k) => {
          return Object.keys(defaults).includes(k)
        }
      )
      const changes: LocalStorage = {}
      for (const [key, value] of Object.entries(defaults)) {
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
      const store = {
        ...storageContent,
        permissions: allPermissions,
        initialized: true
      }
      set(store)
      return store
    }
  }
})

export default useStore
