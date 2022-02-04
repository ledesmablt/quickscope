import { extendedMatch, Fzf } from 'fzf'
import { useMemo } from 'react'
import { SearchEntry } from 'src/types'
import { filterSearchList } from './list'
import searchParser from './searchParser'
import useAsyncSearchList from './useAsyncSearchList'
import useDebounce from './useDebounce'

const LIMIT = 100

interface UseSearch {
  data: SearchEntry[]
  loading: boolean
  empty: boolean
}
export default (searchText: string): UseSearch => {
  const searchInput = useMemo(() => searchParser(searchText), [searchText])
  const debouncedSearchInput = useDebounce(searchInput)

  const {
    searchList: asyncSearchList,
    loading,
    numTriggers: numAsyncTriggers,
    empty
  } = useAsyncSearchList(debouncedSearchInput.searchText)

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
    return resultList.map((r) => r.item)
  }, [debouncedSearchInput.searchText, fzf])

  return {
    data: results,
    loading,
    empty
  }
}
