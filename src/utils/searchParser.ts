import { FieldMatchOptions, FilterFlags } from './list'

interface SearchParserResult {
  searchText: string
  flags: FilterFlags
}

const regex = /([^\s!:=]+)(!?)(:|=)((?:'|").*(?:'|")|[^\s]+)/g
// first group: property name
// second group: match operator
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
  const matches = searchText.matchAll(regex)
  const flags: FilterFlags = {
    string: {},
    array: {}
  }
  let text = searchText
  for (const match of matches) {
    type MatchGroup = [string, any, string, string, string]
    let [allMatched, key, notOperator, matchOperator, value] =
      match as MatchGroup

    if (!value || !matchOperator || !key) {
      continue
    }

    let matchType: FieldMatchOptions['matchType'] = 'includes'
    if (matchOperator === '=') {
      matchType = 'equals'
    }

    for (const q of ['"', "'"]) {
      // trim quotation marks (regex doesn't capture it in a group)
      if (value.startsWith(q) && value.endsWith(q)) {
        value = value.slice(1, value.length - 1)
      }
    }
    if (stringKeys.includes(key)) {
      flags.string[key] = {
        text: value,
        matchType,
        inverse: !!notOperator
      }
    } else if (arrayKeys.includes(key)) {
      flags.array[key] = {
        text: value,
        matchType,
        inverse: !!notOperator
      }
    }
    text = text.replace(allMatched, '')
  }
  return {
    searchText: text.trim() || ' ',
    flags
  }
}
