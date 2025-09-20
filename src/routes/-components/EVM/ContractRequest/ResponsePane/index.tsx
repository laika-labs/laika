import { Button } from '@/components/ui/button'
import { useResponseStore } from '@/store/responses'

import { ReadResponse } from './ReadResponse'
import { WriteResponse } from './WriteResponse'

export function ResponsePane() {
  const { responses, clearResponses } = useResponseStore()

  return (
    <div className="h-full rounded-lg p-4 font-mono text-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-md underline">Response</div>
        <Button variant="outline" onClick={clearResponses}>
          Clear
        </Button>
      </div>
      <div className="h-full overflow-y-auto">
        {responses.length === 0 && <div className="text-center text-gray-500">No responses to display.</div>}
        {responses.map((response) => {
          switch (response.type) {
            case 'READ':
              return <ReadResponse response={response} />
            case 'WRITE':
              return <WriteResponse response={response} />
            default:
              return <></>
          }
        })}
      </div>
    </div>
  )
}
