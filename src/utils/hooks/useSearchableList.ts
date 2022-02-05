import { useEffect, useState } from 'react'
import { SearchItem } from 'src/types'
import { CallExternalOptions } from '../callExternal'
import { buildSearchableList } from '../lists'
import useStore from './useStore'

interface ReturnType {
  data: SearchItem[]
  loading: boolean
  refetch: VoidFunction
  error?: string
  empty: boolean
}
interface Args {
  searchText: string
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
  const [error, setError] = useState<string>()

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
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    refetch,
    error,
    empty: initialized && !loading && !callExternalOptions.length
  }
}
