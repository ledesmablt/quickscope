import React, { ReactElement } from 'react'
import useStateCached from 'src/utils/useStateCached'

// TODO: make this more robust
const options = ['bookmarks', 'my list']

const FilterOptions = (): ReactElement => {
  const [excludeList, setExcludeList] = useStateCached<Record<string, boolean>>(
    'options.filter.excludeList'
  )

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
