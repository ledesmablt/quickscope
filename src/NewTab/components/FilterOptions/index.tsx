import React, { ReactElement } from 'react'
import useStore from 'src/utils/hooks/useStore'
import { FILTER_LIST_OPTIONS, FILTER_LIST_PERMISSION_MAP } from 'src/constants'
import permissions from 'src/utils/browser/permissions'

const FilterOptions = (): ReactElement => {
  const includeLists = useStore((store) => {
    return store.filterOptions_includeLists
  })
  const setIncludeLists = (value: string[]) => {
    useStore.setState({
      filterOptions_includeLists: value
    })
  }

  const onRemove = (option: string) => {
    setIncludeLists(includeLists.filter((v) => v !== option))
  }

  const onAdd = (option: string) => {
    const addToList = () => setIncludeLists([...includeLists, option])
    const requiredPermission = FILTER_LIST_PERMISSION_MAP[option]
    if (!requiredPermission) {
      addToList()
      return
    }
    permissions.request(requiredPermission, (granted) => {
      granted && addToList()
    })
  }

  return (
    <div>
      <p>
        <b>filter options</b>
      </p>
      <p>include lists in search results:</p>
      <div className='flex flex-col gap-1 mt-2'>
        {FILTER_LIST_OPTIONS.map((option) => {
          const id = `filteroption-${option}`
          const checked = includeLists.includes(option)
          return (
            <div key={id} className='flex items-center'>
              <input
                id={id}
                type='checkbox'
                checked={checked}
                onChange={async () => {
                  if (checked) {
                    onRemove(option)
                  } else {
                    onAdd(option)
                  }
                }}
                className='mr-2'
              />
              <label htmlFor={id}>{option}</label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default FilterOptions
