import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import _ from 'lodash'
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
  onImport?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onExport?: VoidFunction
}

const YamlEditor = ({
  value = '',
  onChange,
  onSave,
  onImport,
  onExport
}: Props): ReactElement => {
  const id = useMemo(() => _.uniqueId(), [])
  const [saved, setSaved] = useState(false)

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

      <div className='flex gap-2 pt-2'>
        <button
          disabled={submitDisabled}
          onClick={() => {
            onSave(value)
            setSaved(true)
          }}
        >
          {saved ? 'saved!' : 'save'}
        </button>
        <button hidden={!onImport}>
          <label className='cursor-pointer' htmlFor={`csv-import-${id}`}>
            import
          </label>
          <input
            className='hidden'
            id={`csv-import-${id}`}
            type='file'
            accept='text/csv'
            onChange={onImport}
          />
        </button>
        <button
          hidden={!onExport}
          onClick={onExport}
          disabled={!validatedList?.length}
        >
          export
        </button>
      </div>
    </div>
  )
}
export default YamlEditor
