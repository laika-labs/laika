import { useResponseStore } from '@/store/responses'

export default function ResponsePane() {
  const { responses } = useResponseStore()

  return <div>{JSON.stringify(responses)}</div>
}
