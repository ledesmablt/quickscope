import { FilterFlags } from './list'

interface SearchParserResult {
  searchText: string
  flags: FilterFlags
}

const regex = /([^\s:]+)(:|=)([^\s]*|(["'])(?:(?=(\\?))\2.)*?\1)/g
// first group: property name
// subsequent groups: property value
// everything else: fuzzy search query

const stringKeys: (keyof FilterFlags['string'])[] = [
  'url',
  'title',
  'description',
  'in',
  'label'
]
const arrayKeys: (keyof FilterFlags['array'])[] = ['tag', 'tags']

export default (searchText: string = ''): SearchParserResult => {
  const matches = searchText.matchAll(regex) || []
  const flags: FilterFlags = {
    matchType: 'includes',
    string: {},
    array: {}
  }
  let text = searchText
  for (const match of matches) {
    const key = match?.[1]
    let matchType = match?.[2]
    let value: string = match?.[3]

    if (!value || !matchType || !key) {
      continue
    }
    if (matchType === '=') {
      flags.matchType = 'equals'
    }

    for (const q of ['"', "'"]) {
      // trim quotation marks (regex doesn't capture it in a group)
      if (value.startsWith(q) && value.endsWith(q)) {
        value = value.slice(1, value.length - 1)
      }
    }
    if (stringKeys.includes(key)) {
      flags.string[key] = value
    } else if (arrayKeys.includes(key)) {
      flags.array[key] = value
    }
    text = text.replace(match[0], '')
  }
  return {
    searchText: text.trim() || ' ',
    flags
  }
}
