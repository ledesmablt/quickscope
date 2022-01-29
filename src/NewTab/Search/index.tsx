import React, { ReactElement } from 'react'
import useStateCached from '../utils/useStateCached'
import Suggestions from './Suggestions'

const Search = (): ReactElement => {
  const [searchText, setSearchText] = useStateCached('searchText', '')
  return (
    <div className='flex flex-col h-3/4 min-h-[20rem] max-h-[40rem] w-1/2 min-w-[24rem] max-w-[40rem] text-3xl'>
      <input
        autoFocus
        type='text'
        className='border rounded-t p-2 w-md'
        placeholder='Search'
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value)
        }}
      />
      <Suggestions searchText={searchText} />
    </div>
  )
}
export default Search
