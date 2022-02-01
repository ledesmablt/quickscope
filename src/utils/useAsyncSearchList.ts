import { useEffect, useState } from 'react'
import { SearchEntry } from 'src/types'
import { groupRequests, IGroupRequests } from './list'
import useSearchableList from './useSearchableList'
import useStaticList from './useStaticList'
import useStore from './useStore'

interface AsyncSearchListResult {
  searchList: SearchEntry[]
  numTriggers: number
  loading: boolean
}
export default (searchText: string = ''): AsyncSearchListResult => {
  const [numTriggers, setNumTriggers] = useState(0)

  const { filterOptions_includeLists, externalRequestsConfig } = useStore()

  const [groupedRequests, setGroupedRequests] = useState<IGroupRequests>({
    static: [],
    searchable: []
  })
  useEffect(() => {
    if (externalRequestsConfig) {
      setGroupedRequests(groupRequests(externalRequestsConfig))
    }
  }, [externalRequestsConfig])

  const {
    data: staticList,
    loading: staticLoading,
    refetch: refetchStatic
  } = useStaticList({
    callExternalOptions: groupedRequests.static
  })

  const {
    data: searchableList,
    loading: searchableLoading,
    refetch: refetchSearchable
  } = useSearchableList({
    callExternalOptions: groupedRequests.searchable,
    searchText
  })

  useEffect(() => {
    // reload if includeLists updated
    if (!filterOptions_includeLists) {
      return
    }
    refetchStatic()
    refetchSearchable()
  }, [filterOptions_includeLists])

  useEffect(() => {
    // increment numTriggers when both lists finish loading
    if (staticLoading && searchableLoading) {
      return
    }
    if (staticList.length + searchableList.length) {
      setNumTriggers((n) => n + 1)
    }
  }, [staticLoading, searchableLoading])

  return {
    searchList: [...staticList, ...searchableList],
    loading: staticLoading || searchableLoading,
    numTriggers
  }
}
