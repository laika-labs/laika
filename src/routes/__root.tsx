import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Allotment } from 'allotment'

import { Announcement } from '@/components/Announcement'
import { EVMProvider } from '@/components/EVMProvider'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Sidenav } from '@/components/Sidenav'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import { useEagerMigrationCollections } from '@/hooks/useEagerMigrationCollections'

const queryClient = new QueryClient()

function RootLayout() {
  useEagerMigrationCollections()
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <EVMProvider>
          <Allotment className="!h-screen !w-screen" vertical>
            <Allotment.Pane minSize={24} maxSize={24} className="flex">
              <Announcement />
            </Allotment.Pane>
            <Allotment.Pane minSize={48} maxSize={48} className="flex">
              <Header />
            </Allotment.Pane>
            <Allotment.Pane>
              <Allotment defaultSizes={[80, 80]}>
                <Allotment.Pane minSize={80} maxSize={80}>
                  <Sidenav />
                </Allotment.Pane>
                <Allotment.Pane>
                  <Outlet />
                </Allotment.Pane>
              </Allotment>
            </Allotment.Pane>
            <Allotment.Pane minSize={32} maxSize={32} className="flex">
              <Footer />
            </Allotment.Pane>
          </Allotment>
          <Toaster />
          <ReactQueryDevtools />
          <TanStackRouterDevtools />
        </EVMProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export const Route = createRootRoute({ component: RootLayout })
