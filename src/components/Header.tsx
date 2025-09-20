import { ThemeDropdown } from './ThemeDropdown'
import laikaLogo from '/laika-labs.svg'

export function Header() {
  return (
    <div className="flex grow items-center justify-between px-3">
      <a href="https://getlaika.app/" className="flex items-center space-x-2">
        <img src={laikaLogo} className="h-8 w-8" alt="Laika Labs logo" />
        <span className="font-bold">Laika</span>
      </a>
      <ThemeDropdown />
    </div>
  )
}
