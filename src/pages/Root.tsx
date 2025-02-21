import { Allotment } from 'allotment'
import { Outlet } from 'react-router-dom'

import Header from '@/components/Header'
import Sidenav from '@/components/Sidenav'
import { useEagerMigrationCollections } from '@/hooks/useEagerMigrationCollections'

export default function Root() {
  useEagerMigrationCollections()
  return (
    <Allotment className="w-screen h-screen" vertical>
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
    </Allotment>
  )
}
