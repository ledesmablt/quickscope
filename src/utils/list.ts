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
  matchType: 'includes' | 'equals'
  string: {
    url?: string
    title?: string
    description?: string
    in?: string
    label?: string
  }
  array: {
    tag?: string
    tags?: string
  }
}

// for special keywords that aren't in the SearchEntry Property
const filterPropMap: Record<string, keyof SearchEntry> = {
  in: 'label',
  tag: 'tags',
  'tag=': 'tags',
  'tags=': 'tags'
}

export const filterSearchList = (
  list: SearchEntry[],
  filterFlags: FilterFlags
): SearchEntry[] => {
  let searchList = list
  if (Object.keys(filterFlags.string).length) {
    searchList = searchList.filter((searchEntry) => {
      // searchEntry url must contain stringContains.url, and so on
      return Object.entries(filterFlags.string).every(([key, value]) => {
        const entryKey = filterPropMap[key] || key
        const entryValue: string = searchEntry[entryKey]
        if (!entryValue) {
          return false
        }
        if (filterFlags.matchType === 'equals') {
          return entryValue.toLowerCase() === value.toLowerCase()
        } else if (filterFlags.matchType === 'includes') {
          return entryValue.toLowerCase().search(value.toLowerCase()) >= 0
        } else {
          throw new Error('invalid match type')
        }
      })
    })
  }
  if (Object.keys(filterFlags.array).length) {
    searchList = searchList.filter((searchEntry) => {
      return Object.entries(filterFlags.array).every(([key, value]) => {
        const entryKey = filterPropMap[key] || key
        const entryValue: string[] = searchEntry[entryKey]
        if (!_.isArray(entryValue) || !entryValue?.length) {
          return false
        }
        if (filterFlags.matchType === 'equals') {
          return entryValue.find((v) => v.toLowerCase() === value.toLowerCase())
        } else if (filterFlags.matchType === 'includes') {
          return entryValue.find(
            (v) => v.toLowerCase().search(value.toLowerCase()) >= 0
          )
        } else {
          throw new Error('invalid match type')
        }
      })
    })
  }
  return searchList
}
