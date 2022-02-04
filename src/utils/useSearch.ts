import { extendedMatch, Fzf } from 'fzf'
import { useMemo } from 'react'
import { SearchItem } from 'src/types'
import { filterSearchList } from './list'
import searchParser from './searchParser'
import useAsyncSearchList from './useAsyncSearchList'
import useDebounce from './useDebounce'
import useStore from './useStore'

const LIMIT = 100

interface UseSearch {
  data: SearchItem[]
  loading: boolean
  empty: boolean
}
export default (searchText: string): UseSearch => {
  const searchDebounce = useStore((store) => store.searchDebounce) || 150
  const searchInput = useDebounce(
    useMemo(() => searchParser(searchText), [searchText]),
    searchDebounce
  )

  const {
    searchList: asyncSearchList,
    loading,
    numTriggers: numAsyncTriggers,
    empty
  } = useAsyncSearchList(searchInput.searchText)

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
      searchText && searchInput.searchText
        ? fzf.find(searchInput.searchText)
        : []
    return resultList.map((r) => r.item)
  }, [searchInput.searchText, fzf])

  return {
    data: results,
    loading,
    empty
  }
}
