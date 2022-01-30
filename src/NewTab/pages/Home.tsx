import React, { ReactElement } from 'react'
import Search from '../components/Search'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'

const Home = (): ReactElement => {
  return (
    <div className='grow flex flex-col w-full max-h-[20rem] tall:max-h-[min(80vh,40rem)]'>
      <div className='flex justify-between items-start pb-2'>
        <p className='text-sm'>quickscope</p>
        <div>
          <button
            onClick={() => {
              alert('open filter modal')
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
