// Minimal TypeScript declarations for `howler` to satisfy compiler.
// If available, prefer installing `@types/howler` with npm.

declare module 'howler' {
	export class Howl {
		constructor(options?: Record<string, unknown>)
		play(): number | void
		stop(): void
		unload(): void
		on(event: string, callback: (...args: unknown[]) => void): void
		off(event?: string, callback?: (...args: unknown[]) => void): void
		volume?(v: number): number | void
	}

	export const Howler: {
		volume(v?: number): number | void
	}

	export default Howl
}
