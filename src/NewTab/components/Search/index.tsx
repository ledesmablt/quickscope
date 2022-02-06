import { useNavigate } from 'react-router-dom'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import getKeyAction from 'src/utils/getKeyAction'
import SearchItemRow from '../SearchItemRow'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleNotch,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons'
import useSearch from 'src/utils/hooks/useSearch'
import onLaunch from 'src/utils/onLaunch'

const Search = (): ReactElement => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsContainerRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLDivElement>(null)
  const [searchText, setSearchText] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [disableMouseEvent, setDisableMouseSelect] = useState(false)

  const { data: results, loading, error, empty } = useSearch(searchText)
  const selectedResult = results[selectedIndex]

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
      } else if (e.key === 'p' && (e.ctrlKey || e.metaKey)) {
        // go to settings page
        e.preventDefault()
        navigate('/settings')
      }
    }
    document.addEventListener('keydown', onGlobalKeyDown)
    return () => {
      document.removeEventListener('keydown', onGlobalKeyDown)
    }
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    setDisableMouseSelect(true)

    const keyAction = getKeyAction(e)

    if (keyAction === 'down') {
      // go down 1
      e.preventDefault()
      if (!selectedRef?.current?.nextElementSibling) {
        return
      }
      setSelectedIndex(Math.min(selectedIndex + 1, results.length - 1)) // increment
      // check for out of bounds
      const selectedBottom =
        selectedRef.current.getBoundingClientRect().bottom +
        selectedRef.current.offsetHeight +
        2
      const containerBottom =
        containerRef.current.getBoundingClientRect().bottom
      if (selectedBottom > containerBottom) {
        selectedRef.current.nextElementSibling.scrollIntoView(false)
      }
    } else if (keyAction === 'up') {
      // go up 1
      e.preventDefault()
      if (!selectedRef?.current?.previousElementSibling) {
        return
      }
      setSelectedIndex((i) => Math.max(i - 1, 0)) // decrement
      // check for out of bounds
      const aboveTop =
        selectedRef.current.previousElementSibling.getBoundingClientRect().top +
        2
      const containerTop =
        resultsContainerRef.current.getBoundingClientRect().top
      if (aboveTop < containerTop) {
        selectedRef.current.previousElementSibling.scrollIntoView(true)
      }
    } else if (keyAction === 'bottom') {
      // go to bottom
      e.preventDefault()
      if (!resultsContainerRef.current.lastElementChild) {
        return
      }
      setSelectedIndex(results.length - 1) // set to max
      resultsContainerRef.current.lastElementChild.scrollIntoView(false)
    } else if (keyAction === 'top') {
      // go to top
      e.preventDefault()
      if (!resultsContainerRef.current.firstElementChild) {
        return
      }
      setSelectedIndex(0) // set to min
      resultsContainerRef.current.firstElementChild.scrollIntoView(true)
    } else if (e.key === 'Enter') {
      // launch
      e.preventDefault()
      if (!selectedResult) {
        return
      }
      onLaunch(selectedResult, { newTab: e.ctrlKey || e.metaKey })
    }
  }

  return (
    <>
      <div className='flex justify-between items-end pb-[6px] px-[2px] text-sm'>
        <p className='brand'>quickscope</p>
        {error ? (
          <div className='flex flex-grow justify-end items-end text-red-600 has-tooltip'>
            <span className='tooltip text-[12px] mr-4 p-0 leading-none'>
              error! check console for details
            </span>
            <FontAwesomeIcon icon={faExclamationCircle} size='sm' />
          </div>
        ) : (
          searchText &&
          loading && (
            <FontAwesomeIcon
              className='text-gray-400'
              icon={faCircleNotch}
              spin
              size='sm'
            />
          )
        )}
      </div>
      <div
        ref={containerRef}
        tabIndex={0}
        className='flex flex-col text-2xl grow max-h-[95%]'
        onFocus={() => {
          inputRef?.current?.focus()
        }}
        onKeyDown={onKeyDown}
      >
        <input
          ref={inputRef}
          type='text'
          className='border rounded-t p-2 w-md dark:focus:outline-none'
          placeholder='Search'
          spellCheck={false}
          autoComplete={'off'}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value)
          }}
        />
        {!!results.length && (
          <div
            ref={resultsContainerRef}
            className='flex flex-col grow border text-gray-400 dark:text-gray-200 gap-1 overflow-y-auto'
            onMouseMove={() => {
              setDisableMouseSelect(false)
            }}
          >
            {results.map((result, index) => {
              const isSelected = selectedIndex === index
              return (
                <div
                  ref={index === selectedIndex ? selectedRef : null}
                  key={index}
                  className={`cursor-pointer px-2 py-1 ${
                    isSelected
                      ? 'bg-gray-100 dark:bg-zinc-600 text-gray-600 dark:text-white'
                      : ''
                  }`}
                  onMouseEnter={() => {
                    if (disableMouseEvent) {
                      return
                    }
                    setSelectedIndex(index)
                    inputRef?.current?.focus()
                  }}
                >
                  <SearchItemRow searchItem={result} isSelected={isSelected} />
                </div>
              )
            })}
          </div>
        )}
        {empty && (
          <div className='flex pt-2 justify-end w-full'>
            <p className='text-xs'>
              your list is empty! set it up in the settings page.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
export default Search
