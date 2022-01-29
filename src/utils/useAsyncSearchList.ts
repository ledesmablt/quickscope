import { useEffect, useState } from 'react'
import { SearchEntry } from 'src/types'
import { buildAsyncSearchList } from './list'

interface AsyncSearchListResult {
  searchList: SearchEntry[]
  numTriggers: number
  loading: boolean
}
export default (searchText: string = ''): AsyncSearchListResult => {
  const [searchList, setSearchList] = useState<SearchEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [numTriggers, setNumTriggers] = useState(0)
  useEffect(() => {
    // async list
    const effect = async () => {
      setLoading(true)
      setSearchList(await buildAsyncSearchList(searchText))
      setNumTriggers((n) => n + 1)
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
