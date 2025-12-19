import { GithubIcon, TwitterIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <div className="flex grow items-center">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          render={
            <a href="https://github.com/laika-labs/laika" target="_blank">
              <GithubIcon className="h-4 w-4" />
              <span className="sr-only">Github</span>
            </a>
          }
        />
        <Button
          variant="ghost"
          size="icon"
          render={
            <a href="https://twitter.com/getlaikaapp" target="_blank">
              <TwitterIcon className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </a>
          }
        />
      </div>
    </div>
  )
}
