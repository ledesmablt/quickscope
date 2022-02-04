import { useEffect, useState } from 'react'
import { SearchEntry } from 'src/types'
import { CallExternalOptions } from './callExternal'
import { buildSearchableList } from './list'
import useStore from './useStore'

interface ReturnType {
  data: SearchEntry[]
  loading: boolean
  refetch: VoidFunction
  empty: boolean
}
interface Args {
  searchText: string
  debounce?: number
  callExternalOptions: CallExternalOptions[]
  onCompleted?: (data: SearchEntry[], searchText: string) => void
}
export default ({
  searchText,
  callExternalOptions,
  onCompleted
}: Args): ReturnType => {
  const { initialized } = useStore()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<SearchEntry[]>([])

  useEffect(() => {
    if (searchText.trim()) {
      // only search if searchText provided
      refetch()
    }
  }, [initialized, callExternalOptions, searchText])

  const refetch = async () => {
    if (!initialized) {
      return
    }
    setLoading(true)
    try {
      const result = await buildSearchableList(callExternalOptions, searchText)
      setData(result)
      onCompleted && onCompleted(result, searchText)
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    refetch,
    empty: initialized && !loading && !callExternalOptions.length
  }
}
