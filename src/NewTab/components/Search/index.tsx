import { extendedMatch, Fzf } from 'fzf'
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { buildSearchList } from 'src/utils/list'
import useStateCached from 'src/utils/useStateCached'

import './Search.css'

interface OnLaunchOptions {
  newTab?: boolean
}
const onLaunch = (url: string, options?: OnLaunchOptions) => {
  if (options?.newTab) {
    const win = window.open(url, '_blank')
    win.focus()
  } else {
    window.open(url, '_self')
  }
}

const Search = (): ReactElement => {
  const [searchText, setSearchText] = useStateCached('searchText', '')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const fzf = useMemo(() => {
    const list = buildSearchList()
    return new Fzf(list, {
      selector: (v) => {
        return v.url + v.title
      },
      match: extendedMatch
    })
  }, [])

  const results = searchText ? fzf.find(searchText) : []
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
      className='flex flex-col h-3/4 min-h-[20rem] max-h-[40rem] w-1/2 min-w-[24rem] max-w-[40rem] text-3xl'
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
        }
      }}
    >
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
      <div className='flex flex-col flex-grow border text-gray-400 py-1 gap-1'>
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
              <a href={searchEntry.url}>
                <div className='inline-block w-full'>
                  {result.item.title || result.item.url}
                </div>
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default Search
