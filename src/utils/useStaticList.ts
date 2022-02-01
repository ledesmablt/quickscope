import { useEffect, useState } from 'react'
import { SearchEntry } from 'src/types'
import { CallExternalOptions } from './callExternal'
import { buildStaticList } from './list'
import useStore from './useStore'

interface ReturnType {
  data: SearchEntry[]
  loading: boolean
  refetch: VoidFunction
}
interface Args {
  callExternalOptions: CallExternalOptions[]
  onCompleted?: (data: SearchEntry[]) => void
}
export default ({ callExternalOptions, onCompleted }: Args): ReturnType => {
  const { initialized } = useStore()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<SearchEntry[]>([])

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
    refetch
  }
}
