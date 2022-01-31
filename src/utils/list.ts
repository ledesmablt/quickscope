import _ from 'lodash'
import { SearchEntry } from 'src/types'
import { getBookmarks } from './bookmarks'
import callExternal from './callExternal'
import { parseYamlString } from './dataParser'
import storage from './storage'

const getMyList = async (): Promise<SearchEntry[]> => {
  const excluded = (await storage.get('options.filter.excludeList'))?.myList
  if (excluded) {
    return []
  }
  const myListString = await storage.get('myList')
  const parseResult = parseYamlString(myListString)
  if (parseResult.error) {
    console.error('error parsing "my list"')
    console.error(parseResult.error.message)
  }
  return parseResult.data || []
}

export const makeExternalRequests = async (): Promise<SearchEntry[]> => {
  const externalConfigs = await storage.get('options.list.callExternalConfigs')
  if (!_.isArray(externalConfigs)) {
    return []
  }
  return _.flatten(
    await Promise.all(
      externalConfigs.map(async (externalConfig) => {
        try {
          const data = await callExternal(externalConfig)
          return data
        } catch (err) {
          console.error(err)
          return []
        }
      })
    )
  )
}

// builds only on page load
export const buildStaticList = async () => {
  // DO NOT COMMIT
  const [myList, bookmarks, externalRequests] = await Promise.all([
    getMyList(),
    getBookmarks(),
    makeExternalRequests()
  ])
  return [...myList, ...bookmarks, ...externalRequests]
}

// searchable - useful for API calls expecting frequently changing output
export const buildSearchableList = async (
  searchText: string
): Promise<SearchEntry[]> => {
  return []
}

export interface FilterFlags {
  stringContains: {
    url?: string
    title?: string
    description?: string
    in?: string
  }
  stringEquals: {
    label?: string
  }
}

// for special keywords that aren't in the SearchEntry Property
const filterPropMap: Record<string, keyof SearchEntry> = {
  in: 'label'
}

export const filterSearchList = (
  list: SearchEntry[],
  filterFlags: FilterFlags
): SearchEntry[] => {
  let searchList = list
  if (Object.keys(filterFlags.stringContains).length) {
    searchList = searchList.filter((searchEntry) => {
      // searchEntry url must contain stringContains.url, and so on
      return Object.entries(filterFlags.stringContains).every(
        ([key, value]) => {
          const entryKey = filterPropMap[key] || key
          const entryValue: string = searchEntry[entryKey]
          if (!entryValue) {
            return false
          }
          return entryValue.toLowerCase().search(value.toLowerCase()) >= 0
        }
      )
    })
  }
  if (Object.keys(filterFlags.stringEquals).length) {
    searchList = searchList.filter((searchEntry) => {
      // searchEntry url must contain stringContains.url, and so on
      return Object.entries(filterFlags.stringEquals).every(([key, value]) => {
        const entryValue: string = searchEntry[key]
        if (!entryValue) {
          return false
        }
        return entryValue.toLowerCase() === value.toLowerCase()
      })
    })
  }
  return searchList
}
