import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import storage, { LocalStorage } from './storage'

export default <T>(
  cacheKey: keyof LocalStorage,
  defaultValue?: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(defaultValue)

  useEffect(() => {
    // load value from cache if exists
    const effect = async () => {
      const cachedValue = await storage.get(cacheKey)
      if (cachedValue) {
        setValue(cachedValue as T)
      }
    }
    effect()
  }, [])

  useEffect(() => {
    // update cache on value change
    storage.set({ [cacheKey as string]: value })
  }, [value])

  return [value, setValue]
}
