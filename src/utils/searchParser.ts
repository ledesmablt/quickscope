import { FilterFlags } from './list'

interface SearchParserResult {
  searchText: string
  flags: FilterFlags
}

const regex = /([^\s:]+):([^\s]*|(["'])(?:(?=(\\?))\2.)*?\1)/g
// first group: property name
// subsequent groups: property value
// everything else: fuzzy search query

const stringContainsKeys: (keyof FilterFlags['stringContains'])[] = [
  'url',
  'title',
  'description'
]

export default (searchText: string = ''): SearchParserResult => {
  const matches = searchText.matchAll(regex) || []
  const flags: FilterFlags = {
    stringContains: {}
  }
  let text = searchText
  for (const match of matches) {
    const key = match?.[1]
    const value = match?.[2]

    if (!value || !key) {
      continue
    }
    if (stringContainsKeys.includes(key)) {
      flags.stringContains[key] = value as string
    }
    text = text.replace(match[0], '')
  }
  return {
    searchText: text || ' ',
    flags
  }
}
