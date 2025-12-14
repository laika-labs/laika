import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Allotment } from 'allotment'

import { Announcement } from '@/components/Announcement'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Sidenav } from '@/components/Sidenav'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const queryClient = new QueryClient()

function RootLayout() {
  const isLaptop = useMediaQuery('(min-width: 1024px)')

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <Allotment
          key={isLaptop ? 'laptop' : 'mobile'}
          defaultSizes={[24, 48, 99999, 32]}
          className="h-dvh! w-dvw!"
          vertical
        >
          <Allotment.Pane minSize={24} maxSize={24} className="flex">
            <Announcement />
          </Allotment.Pane>
          <Allotment.Pane minSize={48} maxSize={48} className="flex">
            <Header />
          </Allotment.Pane>
          <Allotment.Pane>
            <Allotment defaultSizes={[80, 99999]} vertical={!isLaptop}>
              {isLaptop && (
                <Allotment.Pane minSize={80} maxSize={80}>
                  <Sidenav />
                </Allotment.Pane>
              )}
              <Allotment.Pane className="[&_div[data-rk='rainbowkit']]:size-full">
                <Outlet />
              </Allotment.Pane>
              {!isLaptop && (
                <Allotment.Pane minSize={80} maxSize={80}>
                  <Sidenav />
                </Allotment.Pane>
              )}
            </Allotment>
          </Allotment.Pane>
          <Allotment.Pane minSize={32} maxSize={32} className="flex" visible={isLaptop}>
            <Footer />
          </Allotment.Pane>
        </Allotment>
        <Toaster />
        <ReactQueryDevtools />
        <TanStackRouterDevtools />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export const Route = createRootRoute({ component: RootLayout })
