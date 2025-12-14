import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useEVMTabStore = create<{
  tabs: string[]
  activeTabId: string | null
  addTab: (id: string) => void
  removeTab: (id: string) => void
  clearTabs: () => void
  setActiveTab: (id: string) => void
  replaceTab: (oldId: string, newId: string) => void
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
      setActiveTab: (id: string) =>
        set((state) => {
          if (state.tabs.includes(id)) {
            return { activeTabId: id }
          }
          return state
        }),
      replaceTab: (oldId: string, newId: string) =>
        set((state) => {
          const index = state.tabs.indexOf(oldId)
          if (index === -1) {
            return state
          }
          const tabs = [...state.tabs]
          tabs[index] = newId
          return {
            tabs,
            activeTabId: state.activeTabId === oldId ? newId : state.activeTabId,
          }
        }),
    }),
    {
      name: 'evmTabs',
    },
  ),
)
