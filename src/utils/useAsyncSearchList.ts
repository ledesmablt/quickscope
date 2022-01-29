import { useEffect, useState } from 'react'
import { SearchEntry } from 'src/types'
import { buildAsyncSearchList } from './list'
import useStateCached from './useStateCached'

interface AsyncSearchListResult {
  searchList: SearchEntry[]
  numTriggers: number
  loading: boolean
}
export default (searchText: string = ''): AsyncSearchListResult => {
  const [searchList, setSearchList] = useStateCached<SearchEntry[]>(
    'asyncSearchList',
    []
  )
  const [loading, setLoading] = useState(false)
  const [numTriggers, setNumTriggers] = useState(0)
  useEffect(() => {
    // async list
    const effect = async () => {
      setLoading(true)
      const newSearchList = await buildAsyncSearchList(searchText)
      if (newSearchList.length > 0) {
        // only save non-empty lists
        setSearchList(newSearchList)
        setNumTriggers((n) => n + 1)
      }
      setLoading(false)
    }
    effect()
  }, [searchText])

  return {
    searchList,
    loading,
    numTriggers
  }
}
