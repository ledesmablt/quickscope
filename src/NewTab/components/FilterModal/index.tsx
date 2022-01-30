import React, { ReactElement } from 'react'
import useStateCached from 'src/utils/useStateCached'
import Modal from '../Modal'

// TODO: make this more robust
const options = ['bookmarks', 'my list']

interface Props {
  open: boolean
  onClose: VoidFunction
}
const FilterModal = ({ open, onClose }: Props): ReactElement => {
  const [excludeList, setExcludeList] = useStateCached<Record<string, boolean>>(
    'options.filter.excludeList'
  )

  return (
    <Modal open={open} onClose={onClose}>
      <div>
        <p className='mb-4'>
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
    </Modal>
  )
}
export default FilterModal
