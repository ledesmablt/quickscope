import { useEffect, useState } from 'react'
import { SearchItem } from 'src/types'
import { CallExternalOptions } from '../callExternal'
import { buildStaticList } from '../lists'
import useStore from './useStore'

interface ReturnType {
  data: SearchItem[]
  loading: boolean
  refetch: VoidFunction
  empty: boolean
}
interface Args {
  callExternalOptions: CallExternalOptions[]
  onCompleted?: (data: SearchItem[]) => void
}
export default ({ callExternalOptions, onCompleted }: Args): ReturnType => {
  const initialized = useStore((store) => store.initialized)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<SearchItem[]>([])

  useEffect(() => {
    refetch()
  }, [initialized, callExternalOptions])

  const refetch = async () => {
    if (!initialized) {
      return
    }
    setLoading(true)
    try {
      const result = await buildStaticList(callExternalOptions)
      setData(result)
      onCompleted && onCompleted(result)
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    refetch,
    empty:
      initialized && !loading && !data.length && !callExternalOptions?.length
  }
}
