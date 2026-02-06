import { useState, useEffect } from 'react'

interface useScreenWidthProps {
  defaultWidthPartNumber: number
  threshold: number
}

export const useScreenWidth = ({
  defaultWidthPartNumber,
  threshold,
}: useScreenWidthProps) => {
  const [widthPartNumber, setWidthPartNumber] = useState(defaultWidthPartNumber)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setWidthPartNumber(threshold)
      } else {
        setWidthPartNumber(defaultWidthPartNumber)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [defaultWidthPartNumber, threshold])

  return widthPartNumber
}
