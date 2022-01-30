import React, { ReactElement, useMemo } from 'react'
import { SearchEntry } from 'src/types'

interface Props {
  searchEntry: SearchEntry
}
const SearchItem = ({ searchEntry }: Props): ReactElement => {
  const infoText = useMemo(() => {
    if (searchEntry.description) {
      return searchEntry.description
    }
    try {
      let { host } = new URL(searchEntry.url)
      host = host.replace(/^www\./, '')
      return host
    } catch {
      return searchEntry.url
    }
  }, [searchEntry.url, searchEntry.description])

  return (
    <a href={searchEntry.url}>
      <div className='inline-block w-full flex justify-between items-end'>
        <span className='truncate w-[calc(100%-6rem)]'>
          {searchEntry.title || searchEntry.url}
        </span>
        {searchEntry.title && (
          <span className='truncate text-xs text-right pl-2 pb-1 w-[6rem]'>
            {infoText}
          </span>
        )}
      </div>
    </a>
  )
}
export default SearchItem
