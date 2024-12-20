import { useEffect, useState } from "react"
export const useLocalStorage = (key: string, defaultValue: string) => {
  const [value, setValue] = useState(() => {
    let currentValue
    try {
      currentValue = JSON.parse(localStorage.getItem(key) || String(defaultValue))
    } catch {
      currentValue = defaultValue
    }
    return currentValue
  })
  useEffect(() => {
    localStorage.setItem(key, value)
  }, [value, key])
  return [value, setValue]
}
