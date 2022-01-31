import { extendedMatch, Fzf } from 'fzf'
import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { filterSearchList } from 'src/utils/list'
import searchParser from 'src/utils/searchParser'
import useAsyncSearchList from 'src/utils/useAsyncSearchList'
import useDebounce from 'src/utils/useDebounce'
import SearchItem from '../SearchItem'

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

const LIMIT = 100

const Search = (): ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsContainerRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLDivElement>(null)
  const [searchText, setSearchText] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [disableMouseEvent, setDisableMouseSelect] = useState(false)

  const searchInput = useMemo(() => searchParser(searchText), [searchText])
  const debouncedSearchInput = useDebounce(searchInput)

  const { searchList: asyncSearchList, numTriggers: numAsyncTriggers } =
    useAsyncSearchList(debouncedSearchInput.searchText)

  const searchList = useMemo(
    () => filterSearchList(asyncSearchList, searchInput.flags),
    [numAsyncTriggers, searchInput.flags.string, searchInput.flags.array]
  )
  const fzf = useMemo(() => {
    return new Fzf(searchList, {
      selector: (v) => {
        return v.title + v.url || '' + v.description || ''
      },
      match: extendedMatch,
      limit: LIMIT
    })
  }, [searchList])

  const results = useMemo(() => {
    const resultList =
      searchText && debouncedSearchInput.searchText
        ? fzf.find(searchInput.searchText)
        : []
    return resultList
  }, [debouncedSearchInput.searchText, fzf])
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

  useEffect(() => {
    // global event listeners
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        if (document.activeElement !== inputRef?.current) {
          // focus input
          e.preventDefault()
          inputRef?.current?.focus()
        }
      }
    }
    document.addEventListener('keydown', onGlobalKeyDown)
    return () => {
      document.removeEventListener('keydown', onGlobalKeyDown)
    }
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    setDisableMouseSelect(true)
    const ctrlPressed = e.ctrlKey || e.metaKey
    if (e.key === 'ArrowDown' || (e.key === 'j' && ctrlPressed)) {
      e.preventDefault()
      if (!selectedRef.current.nextElementSibling) {
        return
      }

      // increment
      setSelectedIndex(Math.min(selectedIndex + 1, results.length - 1))

      // check for out of bounds
      const selectedBottom =
        selectedRef.current.getBoundingClientRect().bottom +
        selectedRef.current.offsetHeight +
        2
      const containerBottom =
        containerRef.current.getBoundingClientRect().bottom
      if (selectedBottom > containerBottom) {
        selectedRef.current.nextElementSibling?.scrollIntoView(false)
      }
    } else if (e.key === 'ArrowUp' || (e.key === 'k' && ctrlPressed)) {
      e.preventDefault()
      if (!selectedRef.current.previousElementSibling) {
        return
      }

      // decrement
      setSelectedIndex((i) => Math.max(i - 1, 0))

      // check for out of bounds
      const aboveTop =
        selectedRef.current.previousElementSibling.getBoundingClientRect().top +
        2
      const containerTop =
        resultsContainerRef.current.getBoundingClientRect().top
      if (aboveTop < containerTop) {
        selectedRef.current.previousElementSibling.scrollIntoView(true)
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (!selectedResult) {
        return
      }
      onLaunch(selectedResult.url, { newTab: ctrlPressed })
    }
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className='flex flex-col text-3xl grow max-h-[95%]'
      onFocus={() => {
        inputRef?.current?.focus()
      }}
      onKeyDown={onKeyDown}
    >
      <input
        ref={inputRef}
        type='text'
        className='border rounded-t p-2 w-md'
        placeholder='Search'
        spellCheck={false}
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value)
        }}
      />
      {!!results.length && (
        <div
          ref={resultsContainerRef}
          className='flex flex-col grow border text-gray-400 gap-1 overflow-y-auto'
          onMouseMove={() => {
            setDisableMouseSelect(false)
          }}
        >
          {results.map((result, index) => {
            const isSelected = selectedIndex === index
            const searchEntry = result.item
            return (
              <div
                ref={index === selectedIndex ? selectedRef : null}
                key={index}
                className={`cursor-pointer px-2 py-1 ${
                  isSelected ? 'bg-gray-100 text-gray-600' : ''
                }`}
                onMouseEnter={() => {
                  if (disableMouseEvent) {
                    return
                  }
                  setSelectedIndex(index)
                  inputRef?.current?.focus()
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
