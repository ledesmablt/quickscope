import React, { ReactElement } from 'react'
import useStore from 'src/utils/useStore'
import { FILTER_LIST_OPTIONS } from 'src/constants'

const FilterOptions = (): ReactElement => {
  const includeLists = useStore((store) => store.filterOptions_includeLists)
  const setIncludeLists = (value: string[]) => {
    useStore.setState({
      filterOptions_includeLists: value
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
                onChange={() => {
                  if (checked) {
                    // remove
                    setIncludeLists(includeLists.filter((v) => v !== option))
                  } else {
                    // add
                    setIncludeLists([...includeLists, option])
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
