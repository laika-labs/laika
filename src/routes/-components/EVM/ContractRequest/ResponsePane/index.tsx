import { useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { useResponseStore } from '@/store/responses'

import { ReadResponse } from './ReadResponse'
import { WriteResponse } from './WriteResponse'

export function ResponsePane() {
  const { responses, clearResponses } = useResponseStore()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const prevResponsesLengthRef = useRef(responses.length)

  useEffect(() => {
    if (responses.length > prevResponsesLengthRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
    prevResponsesLengthRef.current = responses.length
  }, [responses])

  return (
    <div className="flex h-full flex-col rounded-lg p-4 font-mono text-sm">
      <div className="mb-2 flex flex-shrink-0 items-center justify-between">
        <div className="text-md underline">Response</div>
        <Button variant="outline" onClick={clearResponses}>
          Clear
        </Button>
      </div>
      <div ref={scrollContainerRef} className="min-h-0 flex-1 overflow-y-auto">
        {responses.length === 0 && <div className="text-center text-gray-500">No responses to display.</div>}
        {responses.map((response, index) => {
          if (response.type === 'READ') {
            return <ReadResponse key={index} response={response} />
          }
          return <WriteResponse key={index} response={response} />
        })}
      </div>
    </div>
  )
}
