import _ from 'lodash'
import { SearchItem } from 'src/types'
import callExternal, {
  CallExternalOptions,
  interpolateRegex
} from '../callExternal'

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
        return await callExternal(externalConfig, searchText)
      })
    )
  )
}
