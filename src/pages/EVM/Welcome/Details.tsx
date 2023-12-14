import { Button } from '@/components/ui/button'
import { useCallback } from 'react'
import { FolderOpen } from 'lucide-react'

const Details = () => {
  const handleClickMenuButton = useCallback((topicInput: string) => {
    console.log(topicInput)
  }, [])

  return (
    <>
      <p className="text-3xl font-semibold">Laika</p>
      <p className="pt-2 font-light text-md">All your data is saved locally in you browser!</p>
      <div className="flex space-x-1 pt-5 text-base">
        <Button
          variant="default"
          className="hover:underline"
          onClick={() => handleClickMenuButton('Create a new Collection')}
        >
          <FolderOpen />
        </Button>
        <Button
          variant="secondary"
          className="hover:underline"
          onClick={() => handleClickMenuButton('Create a new Smart Contract')}
        >
          Create a new Smart Contract
        </Button>
      </div>
      <p className="mt-4 text-sm text-gray-600">Laika 🐶 is Open Source</p>
      <p className="mt-4 text-sm text-gray-600">
        Give us a Star ⭐️ on{' '}
        <a className="underline" href="https://github.com/laika-labs/laika" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        .
      </p>
    </>
  )
}

export default Details
