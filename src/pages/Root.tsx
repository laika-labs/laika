import { Allotment, LayoutPriority } from 'allotment'
import { Outlet } from 'react-router-dom'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Sidenav from '@/components/Sidenav'

export default function Root() {
  return (
    <Allotment vertical className="w-screen h-screen">
      <Allotment.Pane minSize={48} maxSize={48} className="flex">
        <Header />
      </Allotment.Pane>
      <Allotment.Pane>
        <Allotment proportionalLayout={false}>
          <Allotment.Pane key="activityBar" minSize={80} maxSize={80}>
            <Sidenav />
          </Allotment.Pane>
          <Allotment.Pane key="content" minSize={300} priority={LayoutPriority.High}>
            <Outlet />
          </Allotment.Pane>
        </Allotment>
      </Allotment.Pane>
      <Allotment.Pane minSize={32} maxSize={32} className="flex">
        <Footer />
      </Allotment.Pane>
    </Allotment>
  )
}
