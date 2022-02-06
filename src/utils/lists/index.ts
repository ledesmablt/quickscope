import _ from 'lodash'
import { SearchItem } from 'src/types'
import { getBookmarks } from './bookmarks'
import { CallExternalOptions } from '../callExternal'
import { getMyList } from './myList'
import { getTabs } from './tabs'
import { makeExternalRequests } from './externalRequests'

// builds only on page load
export const buildStaticList = async (
  externalConfigs: CallExternalOptions[]
) => {
  return _.flatten(
    await Promise.all([
      getMyList(),
      getBookmarks(),
      getTabs(),
      makeExternalRequests(externalConfigs)
    ])
  )
}

// searchable - useful for API calls expecting frequently changing output
export const buildSearchableList = async (
  externalConfigs: CallExternalOptions[],
  searchText: string
): Promise<SearchItem[]> => {
  return await makeExternalRequests(externalConfigs, searchText)
}

export interface FieldMatchOptions {
  text: string
  matchType: 'includes' | 'equals'
  inverse?: boolean
  parens?: boolean
}

export interface FilterFlags {
  string: {
    url?: FieldMatchOptions
    title?: FieldMatchOptions
    description?: FieldMatchOptions
    label?: FieldMatchOptions
    in?: FieldMatchOptions
  }
  array: {
    tag?: FieldMatchOptions
    tags?: FieldMatchOptions
  }
}

// for special keywords that aren't in the SearchItem Property
const filterPropMap: Record<string, keyof SearchItem> = {
  in: 'label',
  tag: 'tags'
}

export const filterSearchList = (
  list: SearchItem[],
  filterFlags: FilterFlags
): SearchItem[] => {
  let searchList = list
  if (Object.keys(filterFlags.string).length) {
    searchList = searchList.filter((searchItem) => {
      // searchItem url must contain stringContains.url, and so on
      return Object.entries(filterFlags.string).every(([key, filterFlag]) => {
        const { text, matchType, inverse, parens } = filterFlag
        const property = filterPropMap[key] || key
        const searchItemValue: string = searchItem[property]?.toLowerCase()
        if (!searchItemValue) {
          return false
        }

        // if wrapped in parens, split by "or" operator (|)
        const filterTokens = (!parens ? [text] : text.split('|')).map((t) =>
          t.trim().toLowerCase()
        )
        const result = filterTokens.some((token) => {
          if (matchType === 'equals') {
            return searchItemValue === token
          } else if (matchType === 'includes') {
            return searchItemValue.indexOf(token) >= 0
          } else {
            throw new Error('invalid match type')
          }
        })
        return inverse ? !result : result
      })
    })
  }
  if (Object.keys(filterFlags.array).length) {
    searchList = searchList.filter((searchItem) => {
      return Object.entries(filterFlags.array).every(([key, filterFlag]) => {
        const { text, matchType, inverse, parens } = filterFlag
        const property = filterPropMap[key] || key
        const searchItemValue: string[] = searchItem[property]?.map(
          (s: string) => s.toLowerCase()
        )
        if (!_.isArray(searchItemValue) || !searchItemValue?.length) {
          // no tags
          return inverse
        }

        // if wrapped in parens, split by "or" operator (|)
        const filterTokens = (!parens ? [text] : text.split('|')).map((t) =>
          t.trim().toLowerCase()
        )
        const result = filterTokens.some((token) => {
          // "and" operator
          const textList = token.split(',').map((t) => t.trim())
          return textList.every((t) => {
            if (matchType === 'equals') {
              return !!searchItemValue.find((v) => v === t)
            } else if (matchType === 'includes') {
              return !!searchItemValue.find((v) => v.indexOf(t) >= 0)
            } else {
              throw new Error('invalid match type')
            }
          })
        })
        return inverse ? !result : result
      })
    })
  }
  return searchList
}
