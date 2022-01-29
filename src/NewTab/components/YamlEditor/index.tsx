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

interface Props {
  value: string
  onChange: (newValue: string) => void
  onSave: (parsedData: SearchEntry[]) => void
}

const YamlEditor = ({ value, onChange, onSave }: Props): ReactElement => {
  // TODO: save multiple lists
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    storage.get('myList').then((data) => {
      onChange(yaml.dump(data, { skipInvalid: true }))
    })
  }, [])

  useEffect(() => {
    setSaved(false)
  }, [value])

  const numLines = Math.min(Math.max(15, value.split('\n').length), 25)

  const { data: validatedList, error } = useMemo<YamlParseResult>(() => {
    if (!value) {
      return {}
    }
    let doc: any
    let data: any[]
    let errors: string[] = []
    let errorEntryNum: number
    try {
      doc = yaml.load(value)
      data = doc.map((v: any, index: number) => {
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
  }, [value])

  const submitDisabled = !validatedList || saved

  return (
    <div className='w-full'>
      <textarea
        placeholder={placeholderText}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        rows={numLines}
        className='mt-1 p-1 border rounded w-full font-mono'
      />
      {!!error?.message && <p className='text-red-600 pb-2'>{error.message}</p>}
      <button
        className={`p-1 w-16 border rounded hover:bg-gray-100 ${
          submitDisabled ? 'bg-gray-100 text-gray-400' : ''
        }`}
        disabled={submitDisabled}
        onClick={() => {
          onSave(validatedList)
          setSaved(true)
        }}
      >
        {saved ? 'saved!' : 'save'}
      </button>
    </div>
  )
}
export default YamlEditor
