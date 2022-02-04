import { useEffect, MutableRefObject } from 'react'

export default (callback: () => void, refs: MutableRefObject<any>[]): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutside = refs.every(
        (r) => r.current && !r.current.contains(event.target)
      )
      if (isOutside) {
        callback()
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [refs])
}
