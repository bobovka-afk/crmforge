import { create } from 'zustand'

interface SyncState {
  activeJobId: string | null
  setActiveJobId: (id: string | null) => void
}

export const useSyncStore = create<SyncState>((set) => ({
  activeJobId: null,
  setActiveJobId: (id) => set({ activeJobId: id }),
}))
