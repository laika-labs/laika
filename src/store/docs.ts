import { UUID } from 'crypto'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useEVMDocsStore = create<{
  activeDocumentId: UUID | null
  setActiveDocument: (id: UUID | null) => void
}>()(
  persist(
    (set) => ({
      activeDocumentId: null,
      setActiveDocument: (id) => set({ activeDocumentId: id }),
    }),
    {
      name: 'evmDocs',
    },
  ),
)
