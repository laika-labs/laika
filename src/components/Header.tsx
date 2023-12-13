import laikaLogo from '/laika-labs.svg'
import { Link } from 'react-router-dom'

import { ThemeDropdown } from './ThemeDropdown'

import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Header() {
  return (
    <div className="flex items-center justify-between px-3 grow">
      <Link to="https://getlaika.app/" className="flex items-center space-x-2">
        <img src={laikaLogo} className="w-8 h-8" alt="Laika Labs logo" />
        <span className="font-bold">Laika</span>
      </Link>
      <div className="flex items-center justify-between">
        <ThemeDropdown />
        <div className="mx-2" />
        <ConnectButton />
      </div>
    </div>
  )
}
