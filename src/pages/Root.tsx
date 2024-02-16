import { Allotment } from 'allotment'
import { Outlet } from 'react-router-dom'

import Announcement from '@/components/Announcement'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Sidenav from '@/components/Sidenav'

export default function Root() {
  return (
    <Allotment className="w-screen h-screen" vertical>
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
  )
}
