import { useEffect, useState } from 'react'
import { SearchItem } from 'src/types'
import { CallExternalOptions } from '../callExternal'
import { buildSearchableList } from '../lists'
import useStore from './useStore'

interface ReturnType {
  data: SearchItem[]
  loading: boolean
  refetch: VoidFunction
  empty: boolean
}
interface Args {
  searchText: string
  debounce?: number
  callExternalOptions: CallExternalOptions[]
  onCompleted?: (data: SearchItem[], searchText: string) => void
}
export default ({
  searchText,
  callExternalOptions,
  onCompleted
}: Args): ReturnType => {
  const initialized = useStore((store) => store.initialized)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<SearchItem[]>([])

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
