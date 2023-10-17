import { ThemeDropdown } from '@/components/ThemeDropdown'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Button } from '@/components/ui/button'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <p className="text-red-700">hello laika</p>
      <Button>Click me</Button>
      <ThemeDropdown />
    </ThemeProvider>
  )
}

export default App
