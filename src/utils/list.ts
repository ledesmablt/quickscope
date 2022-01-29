import { SearchEntry } from 'src/types'

export const TEST_LIST = [
  'go',
  'javascript',
  'python',
  'rust',
  'swift',
  'kotlin',
  'elixir',
  'java',
  'lisp',
  'v',
  'zig',
  'nim',
  'rescript',
  'd',
  'haskell'
]

export const buildSearchList = (): SearchEntry[] => {
  // todo: build from different sources
  return TEST_LIST.map((v) => ({
    url: 'https://' + v + '.com',
    title: v
  }))
}

export interface FilterFlags {
  stringContains?: {
    url?: string
    title?: string
    description?: string
  }
}
export const filterSearchList = (
  list: SearchEntry[],
  filterFlags?: FilterFlags
): SearchEntry[] => {
  let searchList = list
  if (Object.keys(filterFlags?.stringContains || {}).length) {
    searchList = searchList.filter((searchEntry) => {
      // searchEntry url must contain stringContains.url, and so on
      return Object.entries(filterFlags.stringContains).every(
        ([key, value]) => {
          const entryValue: string = searchEntry[key]
          if (!entryValue) {
            return false
          }
          return entryValue.toLowerCase().search(value) >= 0
        }
      )
    })
  }
  return searchList
}
