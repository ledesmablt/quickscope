import _ from 'lodash'
import Papa from 'papaparse'
import { parseYamlString } from './dataParser'
import storage from './storage'

export const downloadData = (data: any, filename: string): void => {
  const element = document.createElement('a')
  try {
    const file = new Blob([data])
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
  } catch (err) {
    throw err
  } finally {
    element.remove()
  }
}

export const exportSettingsJson = async () => {
  const allSettings = await storage.get()
  downloadData(JSON.stringify(allSettings, null, 2), 'quickscope_settings.json')
}

export const exportMyListCsv = async (): Promise<void> => {
  const myList = await storage.get('myList')
  const parseResult = parseYamlString(myList)
  if (!parseResult?.data?.length) {
    if (parseResult?.error?.message) {
      alert(`Error: ${parseResult.error.message}`)
      return
    }
    alert('No data to export!')
  }
  const allKeys = _.uniq(parseResult.data.flatMap((d) => Object.keys(d)))
  const result = Papa.unparse(parseResult.data, {
    columns: allKeys
  })
  downloadData(result, 'quicksope_my_list.csv')
}
