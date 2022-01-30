import React, { ReactElement } from 'react'
import { SearchEntry } from 'src/types'

interface Props {
  searchEntry: SearchEntry
}
const SearchItem = ({ searchEntry }: Props): ReactElement => {
  return (
    <a href={searchEntry.url}>
      <div className='inline-block w-full flex justify-between items-end'>
        <span className='truncate grow'>
          {searchEntry.title || searchEntry.url}
        </span>
        {searchEntry.title && (
          <span className='truncate text-xs pl-2'>
            {searchEntry.description || searchEntry.url}
          </span>
        )}
      </div>
    </a>
  )
}
export default SearchItem
