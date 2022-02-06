import { extendedMatch, Fzf } from 'fzf'
import { useMemo } from 'react'
import { SearchItem } from 'src/types'
import { filterSearchList } from '../lists'
import searchParser from '../searchParser'
import useFullSearchList from './useFullSearchList'
import useDebounce from './useDebounce'
import useStore from './useStore'

const LIMIT = 100

interface UseSearch {
  data: SearchItem[]
  loading: boolean
  empty: boolean
  error?: string
}
export default (searchText: string): UseSearch => {
  const searchDebounce = useStore((store) => store.searchDebounce) || 150
  const debouncedSearchText = useDebounce(searchText, searchDebounce)
  const searchInput = useMemo(
    () => searchParser(debouncedSearchText),
    [debouncedSearchText]
  )

  const { searchList, loading, numTriggers, empty, error } = useFullSearchList(
    searchInput.searchText
  )

  const filteredSearchList = useMemo(
    () => filterSearchList(searchList, searchInput.flags),
    [numTriggers, searchInput.flags.string, searchInput.flags.array]
  )
  const fzf = useMemo(() => {
    return new Fzf(filteredSearchList, {
      selector: (v) => {
        return [
          v.title,
          v.label,
          v.description,
          v.tags?.length ? v.tags.join(' ') : '',
          v.url
        ]
          .filter(Boolean)
          .join(' ')
      },
      match: extendedMatch,
      limit: LIMIT
    })
  }, [filteredSearchList])

  const results = useMemo(() => {
    const resultList =
      searchText && searchInput.searchText
        ? fzf.find(searchInput.searchText)
        : []
    return resultList.map((r) => r.item)
  }, [searchInput.searchText, fzf])

  return {
    data: results,
    loading,
    empty,
    error
  }
}
