import React from 'react'

type LoadingMap = Record<string, boolean>

export function useLoadingMap(initial: LoadingMap = {}) {
  const [loadingMap, setLoadingMap] = React.useState<LoadingMap>(initial)

  const setLoadingFor = React.useCallback((key: string, val: boolean) => {
    setLoadingMap(prev => ({ ...prev, [key]: val }))
  }, [])

  const withLoading = React.useCallback(async <T,>(key: string, fn: () => Promise<T>): Promise<T> => {
    setLoadingFor(key, true)
    try {
      const res = await fn()
      return res
    } finally {
      setLoadingFor(key, false)
    }
  }, [setLoadingFor])

  return { loadingMap, setLoadingFor, withLoading }
}
