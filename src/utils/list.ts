import _ from 'lodash'
import { SearchItem } from 'src/types'
import { getBookmarks } from './bookmarks'
import callExternal, {
  CallExternalOptions,
  interpolateRegex
} from './callExternal'
import { parseYamlString } from './dataParser'
import storage from './storage'
import { getTabs } from './tabs'

const getMyList = async (): Promise<SearchItem[]> => {
  const included = (await storage.get('filterOptions_includeLists'))?.includes(
    'my list'
  )
  if (!included) {
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

export interface IGroupRequests {
  static: CallExternalOptions[]
  searchable: CallExternalOptions[]
}
export const groupRequests = (
  externalConfigs: CallExternalOptions[]
): IGroupRequests => {
  const result: IGroupRequests = { static: [], searchable: [] }
  if (!_.isArray(externalConfigs)) {
    return result
  }
  // split into static / searchable
  for (const config of externalConfigs) {
    if (!config.enabled) {
      continue
    }
    const isSearchable =
      JSON.stringify(config.requestConfig).search(interpolateRegex) >= 0
    if (isSearchable) {
      result.searchable.push(config)
    } else {
      result.static.push(config)
    }
  }
  return result
}

export const makeExternalRequests = async (
  externalConfigs: CallExternalOptions[],
  searchText?: string
): Promise<SearchItem[]> => {
  return _.flatten(
    await Promise.all(
      externalConfigs.map(async (externalConfig) => {
        try {
          const data = await callExternal(externalConfig, searchText)
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
  tag: 'tags',
  'tag=': 'tags',
  'tags=': 'tags'
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
