import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type GeolocationStatus = 'idle' | 'prompt' | 'granted' | 'denied' | 'error';

export interface LocationState {
	lat: number | null;
	lon: number | null;
	name: string | null;
	geoStatus: GeolocationStatus;
	lastResolvedAt: number | null;
	_hasHydrated: boolean;
	setLocation: (lat: number, lon: number, name?: string | null) => void;
	setName: (name: string | null) => void;
	setGeoStatus: (status: GeolocationStatus) => void;
	setHasHydrated: (state: boolean) => void;
}

export const useLocation = create<LocationState>()(
	persist(
		(set) => ({
			lat: null,
			lon: null,
			name: null,
			geoStatus: 'idle',
			lastResolvedAt: null,
			_hasHydrated: false,
			setLocation: (lat, lon, name = null) => set({ lat, lon, name, lastResolvedAt: Date.now() }),
			setName: (name) => set({ name }),
			setGeoStatus: (geoStatus) => set({ geoStatus }),
			setHasHydrated: (state) => set({ _hasHydrated: state }),
		}),
		{
			name: 'loc',
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		}
	)
);
