import { useEffect } from 'react'

export function useSilentRefresh(intervalMs: number = 3000) {
  useEffect(() => {
    const interval = setInterval(() => {
      // Silently refresh the page without showing loading indicators
      window.location.reload()
    }, intervalMs)

    return () => {
      clearInterval(interval)
    }
  }, [intervalMs])
}
