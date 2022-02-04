import { SearchItem } from 'src/types'
import { parseYamlString } from 'src/utils/dataParser'
import storage from 'src/utils/browser/storage'

export const getMyList = async (): Promise<SearchItem[]> => {
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
