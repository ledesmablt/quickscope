import _ from 'lodash'
import yaml from 'js-yaml'
import Papa from 'papaparse'
import { SearchItem } from 'src/types'
import validateSearchItem from './validateSearchItem'

export const fileUploadToString = async (
  e: React.ChangeEvent<HTMLInputElement>
): Promise<string> => {
  e.preventDefault()
  return new Promise((resolve, reject) => {
    try {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (event) => {
        try {
          resolve(event.target.result?.toString())
        } catch (err) {
          reject(err)
        }
      }
    } catch (err) {
      reject(err)
    } finally {
      // clear file list
      e.target.value = ''
    }
  })
}

export const importSettingsJson = async (
  e: React.ChangeEvent<HTMLInputElement>,
  updateStorage: (body: any) => void
) => {
  const string = await fileUploadToString(e)
  const res = JSON.parse(string)
  const approved = confirm(
    'Confirm import settings? This will override all your existing settings.'
  )
  if (!approved) {
    return
  }
  updateStorage(res)
  alert('Settings successfully imported')
}

export const importSearchItemsCsv = async (
  e: React.ChangeEvent<HTMLInputElement>
): Promise<SearchItem[]> => {
  const string = await fileUploadToString(e)
  const result = Papa.parse(string, {
    header: true
  })
  if (!result?.data?.length || !_.isArray(result?.data)) {
    alert('No data to import')
    return
  }
  try {
    const formattedResult: SearchItem[] = result.data.map((d) => {
      if (!_.isObjectLike(d)) {
        throw new Error('Parser error. Please double check your file.')
      }
      const formattedItem: SearchItem = _.pickBy(d, Boolean) as any
      if (d.tags && typeof d.tags === 'string') {
        const tags = d.tags.split(',')
        if (tags.length) {
          formattedItem.tags = tags
        }
      }
      return validateSearchItem(formattedItem)
    })
    return formattedResult
  } catch (err: any) {
    alert('Error :' + err?.message || err?.toString())
    throw err
  }
}

export const importMyListCsv = async (
  e: React.ChangeEvent<HTMLInputElement>,
  updateMyList: (value: string) => void
) => {
  const result = await importSearchItemsCsv(e)
  const approved = confirm(
    `Import ${result.length} list items? This will overwrite your current list.`
  )
  if (!approved) {
    return
  }
  updateMyList(yaml.dump(result, { skipInvalid: true }))
  alert('Import successful')
}
