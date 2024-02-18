import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useEVMDocsStore = create<{
  activeDocumentId: string | null
  setActiveDocument: (id: string | null) => void
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
