import { SearchEntry } from 'src/types'
import { formatBookmark, getBookmarks } from './bookmarks'
import storage from './storage'

// builds only on page load
export const buildStaticList = async () => {
  const mySearchList: SearchEntry[] = await storage.get('myList')
  const bookmarks = (await getBookmarks())
    .filter((b) => b.url)
    .map(formatBookmark)
  return [...mySearchList, ...bookmarks]
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
