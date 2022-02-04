import { SearchItem } from 'src/types'
import { parseYamlString } from 'src/utils/dataParser'
import storage from 'src/utils/browser/storage'
import validateSearchItem from '../validateSearchItem'
import yaml from 'js-yaml'
import _ from 'lodash'

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

export const addToMyList = async (object: any): Promise<void> => {
  const list: any[] = []
  if (_.isArrayLike(object)) {
    object.forEach((o: any) => list.push(o))
  } else {
    list.push(object)
  }
  let newItems: SearchItem[]
  try {
    newItems = list.map(validateSearchItem)
  } catch (err: any) {
    alert(`Error while saving - ${err.message}`)
  }
  const newItemsStr = yaml.dump(newItems)
  const myListString = (await storage.get('myList')) || ''
  const updatedList = myListString + '\n' + newItemsStr
  await storage.set({
    myList: updatedList
  })
}
