import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useEVMTabStore = create<{
  tabs: string[]
  activeTabId: string | null
  addTab: (id: string) => void
  removeTab: (id: string) => void
  clearTabs: () => void
  setActiveTab: (id: string) => void
}>()(
  persist(
    (set) => ({
      tabs: [],
      activeTabId: null,
      addTab: (id: string) =>
        set((state) => {
          if (state.tabs.includes(id)) {
            return state
          }
          return { tabs: [...state.tabs, id], activeTabId: id }
        }),
      removeTab: (id: string) =>
        set((state) => {
          const tabs = [...state.tabs]
          const index = tabs.indexOf(id)
          if (index > -1) {
            tabs.splice(index, 1)
          }
          return {
            tabs,
            activeTabId:
              state.activeTabId === id ? (tabs.length > 0 ? tabs[tabs.length - 1] : null) : state.activeTabId,
          }
        }),
      clearTabs: () => set({ tabs: [], activeTabId: null }),
      setActiveTab: (id: string) => set({ activeTabId: id }),
    }),
    {
      name: 'evmTabs',
    },
  ),
)
