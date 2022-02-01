import React, { ReactElement } from 'react'
import useStore from 'src/utils/useStore'

// TODO: make this more robust
const options = ['bookmarks', 'my list']

const FilterOptions = (): ReactElement => {
  const { 'options.filter.excludeList': excludeList } = useStore()
  const setExcludeList = (value: Record<string, boolean>) => {
    useStore.setState({
      'options.filter.excludeList': value
    })
  }

  return (
    <div>
      <p>
        <b>filter options</b>
      </p>
      <p>include lists in search results:</p>
      <div className='flex flex-col gap-1 mt-2'>
        {options.map((option) => {
          const id = `filteroption-${option}`
          const checked = !excludeList?.[option]
          return (
            <div key={id} className='flex items-center'>
              <input
                id={id}
                type='checkbox'
                checked={checked}
                onChange={() => {
                  if (checked) {
                    // add
                    setExcludeList({
                      ...(excludeList || {}),
                      [option]: true
                    })
                  } else {
                    // remove
                    setExcludeList({
                      ...(excludeList || {}),
                      [option]: false
                    })
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
