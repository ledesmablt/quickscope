import axios, { AxiosRequestConfig } from 'axios'
import _ from 'lodash'
import { SearchItem } from 'src/types'
import validateSearchItem from './validateSearchItem'

export const interpolateRegex = /\{\{\s*search_text\s*\}\}/g

export interface CallExternalOptions {
  requestConfig?: AxiosRequestConfig
  propertyMap?: Record<string, string> //url: 'item.link'
  pathToData?: string // _.property
  label?: string
  enabled?: boolean
  name: string
}
export default async (
  { requestConfig, propertyMap, pathToData, label }: CallExternalOptions,
  searchText?: string
): Promise<SearchItem[]> => {
  // make request
  const axiosConfig = formatRequestConfig(requestConfig, searchText)
  const response = await axios(axiosConfig)

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
  const validResult = arrayData.map((item) => {
    // build each item using transformMap
    const formattedItem: Partial<SearchItem> = {}
    for (const [key, path] of Object.entries(propertyMap)) {
      const getProperty = _.property(path)
      formattedItem[key] = getProperty(item)
    }
    if (label && !formattedItem.label) {
      formattedItem.label = label
    }
    // validate schema
    return validateSearchItem(formattedItem)
  })
  return validResult
}

const interpolate = (text: string, searchText: string) => {
  return text.replace(interpolateRegex, searchText)
}

const formatRequestConfig = <T = { [key: string]: any }>(
  data: T,
  searchText: string = ''
): T => {
  const hasSearchQuery = JSON.stringify(data).search(interpolateRegex) >= 0
  if (!hasSearchQuery) {
    return data
  }
  const recurseField = (data: any): any => {
    if (_.isArray(data)) {
      return data.map(recurseField)
    } else if (_.isObjectLike(data)) {
      let newObj: any = {}
      for (const [k, v] of Object.entries(data)) {
        newObj[k] = recurseField(v)
      }
      return newObj
    } else if (typeof data === 'string') {
      return interpolate(data, searchText)
    } else {
      return data
    }
  }
  const interpolatedData = recurseField(data)
  return interpolatedData
}
