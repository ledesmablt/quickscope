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
      return Object.entries(filterFlags.string).every(([key, value]) => {
        const { text, matchType, inverse } = value
        const itemKey = filterPropMap[key] || key
        const itemValue: string = searchItem[itemKey]
        if (!itemValue) {
          return false
        }
        let result: boolean
        if (matchType === 'equals') {
          result = itemValue.toLowerCase() === text.toLowerCase()
        } else if (matchType === 'includes') {
          result = itemValue.toLowerCase().search(text.toLowerCase()) >= 0
        } else {
          throw new Error('invalid match type')
        }
        return inverse ? !result : result
      })
    })
  }
  if (Object.keys(filterFlags.array).length) {
    searchList = searchList.filter((searchItem) => {
      return Object.entries(filterFlags.array).every(([key, value]) => {
        const { text, matchType, inverse } = value
        const itemKey = filterPropMap[key] || key
        const itemValue: string[] = searchItem[itemKey]
        if (!_.isArray(itemValue) || !itemValue?.length) {
          // no tags
          return inverse
        }
        let result: boolean
        if (matchType === 'equals') {
          result = !!itemValue.find(
            (v) => v.toLowerCase() === text.toLowerCase()
          )
        } else if (matchType === 'includes') {
          result = !!itemValue.find(
            (v) => v.toLowerCase().search(text.toLowerCase()) >= 0
          )
        } else {
          throw new Error('invalid match type')
        }
        return inverse ? !result : result
      })
    })
  }
  return searchList
}
