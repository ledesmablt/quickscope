import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import yaml from 'js-yaml'
import _ from 'lodash'
import validateSearchEntry from 'src/utils/validateSearchEntry'
import { SearchEntry } from 'src/types'
import storage from 'src/utils/storage'

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
    line?: number
    col?: number
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
    try {
      doc = yaml.load(myListText)
    } catch (err) {
      if (err instanceof yaml.YAMLException) {
        console.log(err)
        return {
          error: {
            message: err.reason,
            line: err.mark.line,
            col: err.mark.column
          }
        }
      }
      return {
        error: { message: err?.toString() }
      }
    }
    if (!_.isArray(doc)) {
      return {
        error: { message: 'Format should be a bullet list' }
      }
    }
    const errors: string[] = []
    const data = doc
      .map((d) => {
        try {
          return validateSearchEntry(d)
        } catch (err) {
          errors.push(err?.toString())
          return null
        }
      })
      .filter(Boolean)
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
      {!!error?.message && (
        <p className='text-red-600'>
          {typeof error.line === 'number'
            ? `(line ${error.line}, col ${error.col}) `
            : ''}
          {error.message}
        </p>
      )}
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
