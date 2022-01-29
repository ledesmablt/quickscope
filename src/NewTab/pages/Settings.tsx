import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import yaml from 'js-yaml'
import _ from 'lodash'
import validateSearchEntry from 'src/utils/validateSearchEntry'
import { SearchEntry } from 'src/types'
import storage from 'src/utils/storage'
import { ValidationError } from 'yup'

const placeholderText = `# example

- url: http://example.com
  title: title
  description: description

- url: http://another_example.com
`

interface YamlParseResult {
  data?: SearchEntry[]
  error?: {
    message?: string
    entryNum?: number
    coordinates?: {
      line: number
      col: number
    }
  }
}

const Settings = (): ReactElement => {
  // TODO: save multiple lists
  // TODO: move into separate components
  const [myListText, setMyListText] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    storage.get('myList').then((data) => {
      setMyListText(yaml.dump(data, { skipInvalid: true }))
    })
  }, [])

  useEffect(() => {
    setSaved(false)
  }, [myListText])

  const { data: myListData, error } = useMemo<YamlParseResult>(() => {
    if (!myListText) {
      return {}
    }
    let doc: any
    let data: any[]
    let errors: string[] = []
    let errorEntryNum: number
    try {
      doc = yaml.load(myListText)
      data = doc.map((v, index) => {
        try {
          return validateSearchEntry(v)
        } catch (err) {
          errorEntryNum = index
          throw err
        }
      })
    } catch (err) {
      if (err instanceof yaml.YAMLException) {
        return {
          error: {
            message: `(line ${err.mark.line}, col ${err.mark.column}) ${err.reason}`,
            coordinates: {
              line: err.mark.line,
              col: err.mark.column
            }
          }
        }
      } else if (err instanceof ValidationError) {
        return {
          error: {
            message: `(entry #${errorEntryNum}) ${err.message}`,
            entryNum: errorEntryNum
          }
        }
      } else {
        return {
          error: { message: err?.toString() }
        }
      }
    }
    if (!_.isArray(doc)) {
      return {
        error: { message: 'syntax error: format should be a bullet list' }
      }
    }
    return {
      data,
      error: { message: errors.join(', ') }
    }
  }, [myListText])

  const onSaveMyList = () => {
    storage.set({
      myList: myListData
    })
    setSaved(true)
  }

  return (
    <div className='full'>
      <p>settings</p>
      <div className='p-2' />
      <p>my list</p>
      <textarea
        placeholder={placeholderText}
        value={myListText}
        onChange={(e) => {
          setMyListText(e.target.value)
        }}
        rows={10}
        className='mt-1 p-1 border rounded w-full font-mono'
      />
      {!!error?.message && <p className='text-red-600'>{error.message}</p>}
      <div className='mt-2 flex items-center gap-2'>
        <button
          className='p-1 w-16 border rounded'
          disabled={!myListData}
          onClick={onSaveMyList}
        >
          save
        </button>
        {saved && <p>your list has been saved!</p>}
      </div>
    </div>
  )
}
export default Settings
