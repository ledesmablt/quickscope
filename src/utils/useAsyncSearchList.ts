import { useEffect, useState } from 'react'
import { SearchEntry } from 'src/types'
import { buildSearchableList, buildStaticList } from './list'

interface AsyncSearchListResult {
  searchList: SearchEntry[]
  numTriggers: number
  loading: boolean
}
export default (searchText: string = ''): AsyncSearchListResult => {
  // loading
  const [staticLoading, setStaticLoading] = useState(true)
  const [searchableLoading, setSearchableLoading] = useState(true)

  const [numStaticTriggers, setNumStaticTriggers] = useState(0)
  const [numSearchableTriggers, setNumSearchableTriggers] = useState(0)

  // lists
  const [searchList, setSearchList] = useState<SearchEntry[]>([])
  const [staticList, setStaticList] = useState<SearchEntry[]>([])
  const [searchableList, setSearchableList] = useState<SearchEntry[]>([])

  const [numTriggers, setNumTriggers] = useState(0)

  useEffect(() => {
    // load static
    const effect = async () => {
      setStaticList(await buildStaticList())
      setStaticLoading(false)
      setNumStaticTriggers((n) => n + 1)
    }
    effect()
  }, [])

  useEffect(() => {
    // load searchable list
    const effect = async () => {
      setSearchableLoading(true)
      const newSearchList = await buildSearchableList(searchText)
      if (newSearchList?.length) {
        setSearchableList(newSearchList)
        setNumSearchableTriggers((n) => n + 1)
      }
      setSearchableLoading(false)
    }
    effect()
  }, [searchText])

  useEffect(() => {
    if (staticLoading && searchableLoading) {
      return
    }
    const combinedList = [...staticList, ...searchableList]
    if (combinedList.length) {
      setSearchList(combinedList)
      setNumTriggers((n) => n + 1)
    }
  }, [numStaticTriggers, numSearchableTriggers])

  return {
    searchList,
    loading: staticLoading || searchableLoading,
    numTriggers
  }
}
