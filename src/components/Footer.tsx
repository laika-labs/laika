import { Github, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export default function Footer() {
  return (
    <div className="flex items-center grow">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" asChild>
          <Link to="https://github.com/laika-labs/laika" target="_blank">
            <Github className="w-4 h-4" />
            <span className="sr-only">Github</span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link to="https://twitter.com/getlaikaapp" target="_blank">
            <Twitter className="w-4 h-4" />
            <span className="sr-only">Twitter</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
