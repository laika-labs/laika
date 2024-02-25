import { useCallback, useState } from 'react'

export const useCopyToClipboard = (): [string | null, (text: string) => Promise<boolean>] => {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      return true
    } catch {
      setCopiedText(null)
      return false
    }
  }, [])

  return [copiedText, copy]
}
