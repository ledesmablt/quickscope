import React, { ReactElement, useEffect, useState } from 'react'
import { CallExternalOptions } from 'src/utils/callExternal'
import useStore, { Store } from 'src/utils/useStore'
import Form, { formatAsStrings, newOptionDefault } from './Form'

const ExternalRequestsConfig = (): ReactElement => {
  const { 'options.list.callExternalConfigs': cachedOptions } = useStore()
  const saveCachedOptions = (
    value: Store['options.list.callExternalConfigs']
  ) =>
    useStore.setState({
      'options.list.callExternalConfigs': value
    })

  const [options, setOptions] = useState(
    (cachedOptions || []).map(formatAsStrings)
  )
  useEffect(() => {
    // override options on state changes
    if (cachedOptions) {
      setOptions(cachedOptions.map(formatAsStrings))
    }
  }, [cachedOptions])

  const onAdd = () => {
    setOptions([...options, newOptionDefault])
  }

  const onSave = (newOption: CallExternalOptions, index: number) => {
    if (!cachedOptions) {
      // first time setting
      saveCachedOptions([newOption])
    } else if (index >= cachedOptions.length) {
      // append
      saveCachedOptions([...cachedOptions, newOption])
    } else {
      // replace
      saveCachedOptions(
        cachedOptions.map((option, i) => (i === index ? newOption : option))
      )
    }
  }

  const onRemove = (index: number) => {
    saveCachedOptions(cachedOptions.filter((_option, i) => i !== index))
    setOptions(options.filter((_option, i) => i !== index))
  }

  return (
    <div className='flex flex-col items-start gap-4 py-2'>
      {options?.map((option, index) => {
        return (
          <Form
            key={index}
            isNew={index >= cachedOptions?.length}
            defaultValue={option}
            onSave={(newOption) => {
              onSave(newOption, index)
            }}
            onRemove={() => {
              onRemove(index)
            }}
          />
        )
      })}
      <button className='mt-2' onClick={onAdd}>
        add new
      </button>
    </div>
  )
}
export default ExternalRequestsConfig
