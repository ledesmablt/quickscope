import { useEffect, useState } from 'react'
import { SearchItem } from 'src/types'
import { CallExternalOptions } from '../callExternal'
import { buildStaticList } from '../lists'
import useStore from './useStore'

interface ReturnType {
  data: SearchItem[]
  loading: boolean
  refetch: VoidFunction
  error?: string
  empty: boolean
}
interface Args {
  callExternalOptions: CallExternalOptions[]
  onCompleted?: (data: SearchItem[]) => void
}
export default ({ callExternalOptions, onCompleted }: Args): ReturnType => {
  const initialized = useStore((store) => store.initialized)
  const filterOptions = useStore((store) => store.includeLists)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<SearchItem[]>([])
  const [error, setError] = useState<string>()

  useEffect(() => {
    refetch()
  }, [initialized, filterOptions, callExternalOptions])

  const refetch = async () => {
    if (!initialized) {
      return
    }
    setError(null)
    setLoading(true)
    try {
      const result = await buildStaticList(callExternalOptions)
      setData(result)
      onCompleted && onCompleted(result)
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
    empty:
      initialized && !loading && !data.length && !callExternalOptions?.length
  }
}
