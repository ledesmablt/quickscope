import { useEffect, useState } from 'react'
import { SearchItem } from 'src/types'
import { groupRequests, IGroupRequests } from '../lists/externalRequests'
import useSearchableList from './useSearchableList'
import useStaticList from './useStaticList'
import useStore from './useStore'

interface FullSearchListResult {
  searchList: SearchItem[]
  numTriggers: number
  loading: boolean
  empty: boolean
  error?: string
}
export default (searchText: string = ''): FullSearchListResult => {
  const [numTriggers, setNumTriggers] = useState(0)

  const includeListsCached = useStore((store) => store.includeLists)
  const externalRequestsConfig = useStore(
    (store) => store.externalRequestsConfig
  )

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
    refetch: refetchStatic,
    error: staticError,
    empty: staticEmpty
  } = useStaticList({
    callExternalOptions: groupedRequests.static
  })

  const {
    data: searchableList,
    loading: searchableLoading,
    refetch: refetchSearchable,
    error: searchableError,
    empty: searchableEmpty
  } = useSearchableList({
    callExternalOptions: groupedRequests.searchable,
    searchText
  })

  useEffect(() => {
    // reload if includeLists updated
    if (!includeListsCached) {
      return
    }
    refetchStatic()
    refetchSearchable()
  }, [includeListsCached])

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
    numTriggers,
    error: searchableError || staticError,
    empty: staticEmpty && searchableEmpty
  }
}
