import { useCallback } from 'react'

export const useScrollToTop = (top = 0) => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top,
      behavior: 'smooth',
    })
  }, [])

  return scrollToTop
}
