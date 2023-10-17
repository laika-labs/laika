import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { ThemeProvider } from '@/components/ThemeProvider'
import EVM from './EVM'

const router = createBrowserRouter([
  {
    path: '/',
    element: <EVM />,
  },
])

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
