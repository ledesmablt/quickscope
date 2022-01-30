import _ from 'lodash'
import React, { ReactElement, useEffect, useState } from 'react'
import callExternal, { CallExternalOptions } from 'src/utils/callExternal'

type FormValues = {
  [Property in keyof CallExternalOptions]: string
}

export const newOptionDefault: FormValues = {
  requestConfig: `{
  "url": "https://api.example.com",
  "headers": {
    "Authorization": "Bearer token"
  }
}`,
  transformMap: `{
  "url": "path.to.url",
  "title": "path.to.title"
}`,
  name: 'New Request Config'
}

export const formatAsStrings = (options: CallExternalOptions): FormValues => {
  const formattedValues: FormValues = {}
  for (const [key, value] of Object.entries(options)) {
    if (_.isObjectLike(value)) {
      formattedValues[key] = JSON.stringify(value, null, 2)
    } else {
      formattedValues[key] = value
    }
  }
  return formattedValues
}

export const formatAsOptions = (
  formValues: FormValues
): CallExternalOptions => {
  return {
    ...formValues,
    requestConfig: JSON.parse(formValues.requestConfig),
    transformMap: JSON.parse(formValues.transformMap)
  }
}

const attemptJSONParse = (text: string): string => {
  try {
    JSON.parse(text)
    return ''
  } catch (err) {
    if (err instanceof SyntaxError) {
      return err.message
    }
    return err?.toString()
  }
}

interface TestStatus {
  loading?: boolean
  ok?: boolean
  error?: string
}

interface Props {
  id: string | number
  defaultValue: FormValues
  onSave: (newOptions: CallExternalOptions) => void
  onRemove: VoidFunction
}
const Form = ({ id, defaultValue, onSave, onRemove }: Props): ReactElement => {
  const [formValues, setFormValues] = useState<FormValues>(defaultValue)
  const [testStatus, setTestStatus] = useState<TestStatus>({})

  const errors: FormValues = {
    name: !formValues.name && 'name is required',
    transformMap: attemptJSONParse(formValues.transformMap),
    requestConfig: attemptJSONParse(formValues.requestConfig)
  }

  useEffect(() => {
    setTestStatus({})
  }, [formValues])

  const onTest = async () => {
    setTestStatus({
      loading: true
    })
    const options = formatAsOptions(formValues)
    try {
      await callExternal(options)
      setTestStatus({
        ok: true
      })
    } catch (err: any) {
      setTestStatus({
        ok: false,
        error: err?.message || err?.toString()
      })
    }
  }

  const onSaveInner = () => {
    const options = formatAsOptions(formValues)
    onSave(options)
  }

  return (
    <div className='w-full border p-2 flex flex-col gap-1 items-start'>
      <label htmlFor={`form-${id}-name`}>name</label>
      <input
        id={`form-${id}-name`}
        className='border rouded p-1'
        type='text'
        spellCheck={false}
        value={formValues.name}
        onChange={(e) => {
          setFormValues({
            ...formValues,
            name: e.target.value
          })
        }}
      />
      {errors.name && <p className='error'>{errors.name}</p>}

      <label className='mt-1' htmlFor={`form-${id}-label`}>
        label (optional)
      </label>
      <input
        id={`form-${id}-label`}
        className='border rounded p-1'
        type='text'
        spellCheck={false}
        value={formValues.label}
        onChange={(e) => {
          setFormValues({
            ...formValues,
            label: e.target.value
          })
        }}
      />

      <label className='mt-1' htmlFor={`form-${id}-pathToData`}>
        path to data (optional)
      </label>
      <input
        id={`form-${id}-pathToData`}
        className='border rounded p-1'
        type='text'
        spellCheck={false}
        value={formValues.pathToData}
        onChange={(e) => {
          setFormValues({
            ...formValues,
            pathToData: e.target.value
          })
        }}
      />

      <label className='mt-1' htmlFor={`form-${id}-requestConfig`}>
        axios request config
      </label>
      <textarea
        id={`form-${id}-requestConfig`}
        rows={10}
        className='code'
        spellCheck={false}
        value={formValues.requestConfig}
        onChange={(e) => {
          setFormValues({
            ...formValues,
            requestConfig: e.target.value
          })
        }}
      />
      {errors.requestConfig && <p className='error'>{errors.requestConfig}</p>}

      <label className='mt-1' htmlFor={`form-${id}-transformMap`}>
        transform map
      </label>
      <textarea
        id={`form-${id}-transformMap`}
        rows={10}
        className='code'
        spellCheck={false}
        value={formValues.transformMap}
        onChange={(e) => {
          setFormValues({
            ...formValues,
            transformMap: e.target.value
          })
        }}
      />
      {errors.transformMap && <p className='error'>{errors.transformMap}</p>}

      <div className='mt-2 flex flex-col items-start gap-1'>
        <p>
          <b>actions</b>
        </p>
        <div className='flex gap-2'>
          <button onClick={onTest}>test</button>
          {testStatus?.error && (
            <p className='text-red-600'>{testStatus.error}</p>
          )}
          {testStatus?.loading && <p>loading...</p>}
          {testStatus?.ok && <p className='text-green-800'>OK!</p>}
        </div>
        <button onClick={onSaveInner} disabled={!testStatus?.ok}>
          save
        </button>
        <button onClick={onRemove} disabled={testStatus?.loading}>
          remove
        </button>
      </div>
    </div>
  )
}
export default Form
