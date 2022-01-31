import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import yaml from 'js-yaml'
import _ from 'lodash'
import storage from 'src/utils/storage'
import { parseYamlString } from 'src/utils/dataParser'

const placeholderText = `# example

- url: http://example.com
  title: title
  description: description

- url: http://another_example.com
`

interface Props {
  value: string
  onChange: (newValue: string) => void
  onSave: (value: string) => void
}

const YamlEditor = ({ value = '', onChange, onSave }: Props): ReactElement => {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    storage.get('myList').then((data) => {
      onChange(yaml.dump(data, { skipInvalid: true }))
    })
  }, [])

  useEffect(() => {
    setSaved(false)
  }, [value])

  const numLines = Math.min(Math.max(10, value.split('\n').length), 25)

  const { data: validatedList, error } = useMemo(() => {
    if (!value) {
      return {}
    }
    return parseYamlString(value)
  }, [value])

  const submitDisabled = !validatedList || saved

  const getErrorMessage = (): string => {
    if (!error) {
      return ''
    }
    let message = ''
    if (error.location) {
      message += `(${error.location}) `
    }
    message += error.message
    return message
  }
  const errorMessage = getErrorMessage()

  return (
    <div className='w-full'>
      <textarea
        placeholder={placeholderText}
        spellCheck={false}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        rows={numLines}
        className='code mt-1'
      />
      {!!errorMessage && <p className='error'>{errorMessage}</p>}
      <button
        className='mt-2'
        disabled={submitDisabled}
        onClick={() => {
          onSave(value)
          setSaved(true)
        }}
      >
        {saved ? 'saved!' : 'save'}
      </button>
    </div>
  )
}
export default YamlEditor
