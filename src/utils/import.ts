import _ from 'lodash'
import yaml from 'js-yaml'
import Papa from 'papaparse'
import { SearchItem } from 'src/types'
import validateSearchItem from './validateSearchItem'
import validateSettings from './validateSettings'

interface FileUploadResult {
  filename: string
  data: string
  type: string
}
export const fileUploadToString = async (
  e: React.ChangeEvent<HTMLInputElement>
): Promise<FileUploadResult> => {
  e.preventDefault()
  return new Promise((resolve, reject) => {
    try {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (event) => {
        try {
          resolve({
            filename: file.name,
            data: event.target.result?.toString(),
            type: file.type
          })
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
  const { data } = await fileUploadToString(e)
  const newSettings = validateSettings(JSON.parse(data))
  const approved = confirm(
    'Confirm import settings? This will override all your existing settings.'
  )
  if (!approved) {
    return
  }
  updateStorage(newSettings)
  alert('Settings successfully imported')
}

export const importSearchItems = async (
  e: React.ChangeEvent<HTMLInputElement>
): Promise<SearchItem[]> => {
  const { data, type } = await fileUploadToString(e)

  let result: any[] = []
  if (type === 'application/json') {
    result = JSON.parse(data)
  } else if (type === 'text/csv') {
    result = Papa.parse(data, {
      header: true
    })?.data
  } else {
    alert('Invalid file type')
    return
  }

  if (!result?.length || !_.isArray(result)) {
    alert('No data to import')
    return
  }
  try {
    const formattedResult: SearchItem[] = result.map((d) => {
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

export const importMyList = async (
  e: React.ChangeEvent<HTMLInputElement>,
  updateMyList: (value: string) => void
) => {
  const result = await importSearchItems(e)
  const approved = confirm(
    `Import ${result.length} list items? This will overwrite your current list.`
  )
  if (!approved) {
    return
  }
  updateMyList(yaml.dump(result, { skipInvalid: true }))
  alert('Import successful')
}
