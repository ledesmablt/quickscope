import axios, { AxiosRequestConfig } from 'axios'
import _ from 'lodash'
import { SearchEntry } from 'src/types'
import validateSearchEntry from './validateSearchEntry'

export interface CallExternalOptions {
  requestConfig?: AxiosRequestConfig
  transformMap?: Record<string, string> //url: 'item.link'
  pathToData?: string // _.property
  label?: string
  enabled?: boolean
  name?: string
}
export default async ({
  requestConfig,
  transformMap,
  pathToData,
  label
}: CallExternalOptions): Promise<SearchEntry[]> => {
  // make request
  const response = await axios(requestConfig)

  // get array
  let arrayData = response?.data
  if (pathToData) {
    const getProperty = _.property(pathToData)
    arrayData = getProperty(arrayData)
  }
  if (!_.isArray(arrayData)) {
    throw new Error(`${pathToData} must be an array, got ${typeof arrayData}`)
  }

  // build list
  const validResult = arrayData.map((entry) => {
    // build each entry using transformMap
    const formattedEntry: Partial<SearchEntry> = {}
    for (const [key, path] of Object.entries(transformMap)) {
      const getProperty = _.property(path)
      formattedEntry[key] = getProperty(entry)
    }
    if (label && !formattedEntry.label) {
      formattedEntry.label = label
    }
    // validate schema
    return validateSearchEntry(formattedEntry)
  })
  return validResult
}
