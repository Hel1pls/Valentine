import { create } from 'zustand'

export const useSceneStore = create<{
	scene: 'intro' | 'love'
	start: () => void
}>(set => ({
	scene: 'intro',
	start: () => set({ scene: 'love' }),
}))
