import { useCallback, useEffect, useState } from "react"

export const useTimeCounter = (
  initialSeconds: number,
  enabled: boolean = true
): { countingTime: number; isEnd: boolean; reset: () => void } => {
  const [countingTime, setCountingTime] = useState(initialSeconds)
  const [isEnd, setIsEnd] = useState(!enabled)

  useEffect(() => {
    if (enabled && countingTime > 0 && !isEnd) {
      const interval = setInterval(() => {
        setCountingTime((prev) => {
          if (prev === 1) {
            setIsEnd(true)
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [countingTime, isEnd, enabled])

  const reset = useCallback(() => {
    setCountingTime(initialSeconds)
    setIsEnd(false)
  }, [initialSeconds])

  return { countingTime, isEnd, reset }
}
