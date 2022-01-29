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
    let value: string = match?.[2]

    if (!value || !key) {
      continue
    }
    for (const q of ['"', "'"]) {
      // trim quotation marks (regex doesn't capture it in a group)
      if (value.startsWith(q) && value.endsWith(q)) {
        value = value.slice(1, value.length - 1)
        console.log(value)
      }
    }
    if (stringContainsKeys.includes(key)) {
      flags.stringContains[key] = value
    }
    text = text.replace(match[0], '')
  }
  return {
    searchText: text.trim() || ' ',
    flags
  }
}
