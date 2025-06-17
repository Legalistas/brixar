'use client'

import { useState, useEffect } from 'react'

const useResize = () => {
  const [isMobile, setIsMobile] = useState(true)
  const [isTablet, setIsTablet] = useState(true)

  const handleResize = () => {
    setIsTablet(() => window.innerWidth < 1024)
    setIsMobile(() => window.innerWidth < 790)
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    isMobile,
    isTablet,
  }
}

export default useResize
