import { extendedMatch, Fzf } from 'fzf'
import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { buildSearchList, filterSearchList } from 'src/utils/list'
import searchParser from 'src/utils/searchParser'
import useAsyncSearchList from 'src/utils/useAsyncSearchList'
import useDebounce from 'src/utils/useDebounce'
import useStateCached from 'src/utils/useStateCached'
import SearchItem from '../SearchItem'

import './Search.css'

interface OnLaunchOptions {
  newTab?: boolean
}
const onLaunch = (url: string, options?: OnLaunchOptions) => {
  if (options?.newTab) {
    window.open(url, '_blank')
  } else {
    window.open(url, '_self')
  }
}

const Search = (): ReactElement => {
  const inputRef = useRef<HTMLInputElement>()
  const [searchText, setSearchText] = useStateCached('searchText', '')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const debouncedSearchText = useDebounce(searchText)
  const searchInput = useMemo(
    () => searchParser(debouncedSearchText),
    [debouncedSearchText]
  )

  const { searchList: asyncSearchList, numTriggers: numAsyncTriggers } =
    useAsyncSearchList(debouncedSearchText)
  const fzf = useMemo(() => {
    // TODO: optimize
    const syncSearchList = buildSearchList()
    const list = filterSearchList(
      [...syncSearchList, ...asyncSearchList],
      searchInput.flags
    )
    return new Fzf(list, {
      selector: (v) => {
        return v.title + v.url || '' + v.description || ''
      },
      match: extendedMatch
    })
  }, [
    numAsyncTriggers,
    searchInput.flags.stringContains,
    searchInput.flags.stringEquals
  ])

  const results = searchText ? fzf.find(searchInput.searchText) : []
  const selectedResult = results[selectedIndex]?.item

  useEffect(() => {
    // prevent out of bounds selections
    if (!results.length) {
      return
    }
    if (selectedIndex >= results.length) {
      setSelectedIndex(results.length - 1)
    } else if (selectedIndex < 0) {
      setSelectedIndex(0)
    }
  }, [results.length, selectedIndex])

  return (
    <div
      tabIndex={0}
      className='flex flex-col text-3xl full'
      onFocus={() => {
        inputRef?.current?.focus()
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex(Math.min(selectedIndex + 1, results.length - 1))
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex((i) => Math.max(i - 1, 0))
        } else if (e.key === 'Enter') {
          e.preventDefault()
          if (!selectedResult) {
            return
          }
          onLaunch(selectedResult.url, { newTab: e.ctrlKey || e.metaKey })
        } else if (e.key === '/') {
          if (document.activeElement !== inputRef?.current) {
            // focus input
            e.preventDefault()
            inputRef?.current?.focus()
          }
        }
      }}
    >
      <input
        ref={inputRef}
        autoFocus
        type='text'
        className='border rounded-t p-2 w-md'
        placeholder='Search'
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value)
        }}
      />
      {!!results.length && (
        <div className='flex flex-col flex-grow border text-gray-400 gap-1 overflow-y-auto'>
          {results.map((result, index) => {
            const isSelected = selectedIndex === index
            const searchEntry = result.item
            return (
              <div
                key={index}
                className={`cursor-pointer px-2 py-1 ${
                  isSelected ? 'Search_selected' : ''
                }`}
                onMouseEnter={() => {
                  setSelectedIndex(index)
                }}
              >
                <SearchItem searchEntry={searchEntry} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
export default Search
