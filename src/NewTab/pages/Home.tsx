import React, { ReactElement, useState } from 'react'
import Search from '../components/Search'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import FilterModal from '../components/FilterModal'

const Home = (): ReactElement => {
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <div className='grow flex flex-col w-full max-h-[20rem] tall:max-h-[min(80vh,40rem)]'>
      <FilterModal open={filterOpen} onClose={() => setFilterOpen(false)} />

      <div className='flex justify-between items-start pb-2'>
        <p className='text-sm'>quickscope</p>
        <div>
          <button
            tabIndex={-1}
            onClick={() => {
              setFilterOpen(true)
            }}
          >
            <FontAwesomeIcon icon={faFilter} size={'sm'} />
          </button>
        </div>
      </div>
      <Search />
      <div className='pb-4 tall:pb-8' />
    </div>
  )
}
export default Home
