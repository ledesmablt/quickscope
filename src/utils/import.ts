import _ from 'lodash'
import yaml from 'js-yaml'
import Papa from 'papaparse'
import { SearchEntry } from 'src/types'
import storage from './storage'
import validateSearchEntry from './validateSearchEntry'

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
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const string = await fileUploadToString(e)
  const res = JSON.parse(string)
  const approved = confirm(
    'Confirm import settings? This will override all your existing settings.'
  )
  if (!approved) {
    return
  }
  await storage.clear()
  storage.set(res)
  alert('Settings successfully imported')
  window.location.reload()
}

export const importSearchEntriesCsv = async (
  e: React.ChangeEvent<HTMLInputElement>
): Promise<SearchEntry[]> => {
  const string = await fileUploadToString(e)
  const result = Papa.parse(string, {
    header: true
  })
  if (!result?.data?.length || !_.isArray(result?.data)) {
    alert('No data to import')
    return
  }
  try {
    const formattedResult: SearchEntry[] = result.data.map((d) => {
      if (!_.isObjectLike(d)) {
        throw new Error('Parser error. Please double check your file.')
      }
      const formattedEntry: SearchEntry = _.pickBy(d, Boolean) as any
      if (d.tags && typeof d.tags === 'string') {
        const tags = d.tags.split(',')
        if (tags.length) {
          formattedEntry.tags = tags
        }
      }
      return validateSearchEntry(formattedEntry)
    })
    return formattedResult
  } catch (err: any) {
    alert('Error :' + err?.message || err?.toString())
  }
}

export const importMyListCsv = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const result = await importSearchEntriesCsv(e)
  const approved = confirm(
    `Import ${result.length} entries? This will overwrite your current list.`
  )
  if (!approved) {
    return
  }
  await storage.set({
    myList: yaml.dump(result, { skipInvalid: true })
  })
  alert('Import successful')
  window.location.reload()
}
