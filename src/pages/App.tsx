import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { EVMProvider } from '@/components/EVMProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'

import EVM from './EVM'
import Root from './Root'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [{ index: true, element: <EVM /> }],
  },
])

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <EVMProvider>
        <RouterProvider router={router} />
        <Toaster />
      </EVMProvider>
    </ThemeProvider>
  )
}

export default App
