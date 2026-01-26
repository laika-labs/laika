import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface EVMTabStore {
  tabs: string[]
  activeTabId: string | null
  addTab: (id: string) => void
  removeTab: (id: string) => void
  clearTabs: () => void
  setActiveTab: (id: string) => void
  replaceTab: (oldId: string, newId: string) => void
}

export const useEVMTabStore = create<EVMTabStore>()(
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
          const tabs = state.tabs.filter((tabId) => tabId !== id)
          const activeTabId =
            state.activeTabId === id ? (tabs.length > 0 ? tabs[tabs.length - 1] : null) : state.activeTabId
          return { tabs, activeTabId }
        }),

      clearTabs: () => set({ tabs: [], activeTabId: null }),

      setActiveTab: (id: string) =>
        set((state) => {
          if (state.tabs.includes(id)) {
            return { activeTabId: id }
          }
          console.warn(`[TabStore] Attempted to set non-existent tab as active: ${id}`)
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
