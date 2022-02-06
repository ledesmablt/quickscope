import React, { ReactElement, useMemo } from 'react'
import { SearchItem } from 'src/types'

interface Props {
  searchItem: SearchItem
  isSelected?: boolean
}
const SearchItemRow = ({ searchItem, isSelected }: Props): ReactElement => {
  const infoText = useMemo(() => {
    if (searchItem.description) {
      return searchItem.description
    }
    try {
      let { host } = new URL(searchItem.url)
      host = host.replace(/^www\./, '')
      return host
    } catch {
      return searchItem.url
    }
  }, [searchItem.url, searchItem.description])

  return (
    <a
      href={searchItem.url}
      className={!isSelected ? 'unselected-search-item-row' : ''}
    >
      <div className='inline-block w-full flex justify-between items-end'>
        <span className='truncate w-[calc(100%-6rem)]'>
          {searchItem.title || searchItem.url}
        </span>
        {searchItem.title && (
          <span className='truncate text-xs text-right pl-2 pb-1 w-[6rem]'>
            {infoText}
          </span>
        )}
      </div>
    </a>
  )
}
export default SearchItemRow
