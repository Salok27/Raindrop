import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TemperatureUnit = 'f' | 'c';
export type WindUnit = 'mph' | 'kmh' | 'ms';
export type PrecipUnit = 'in' | 'mm';
export type PressureUnit = 'hPa' | 'inHg';
export type ThemePreference = 'system' | 'light' | 'dark';

export interface PreferencesState {
	temperatureUnit: TemperatureUnit;
	windUnit: WindUnit;
	precipUnit: PrecipUnit;
	pressureUnit: PressureUnit;
	theme: ThemePreference;
	setTemperatureUnit: (unit: TemperatureUnit) => void;
	setWindUnit: (unit: WindUnit) => void;
	setPrecipUnit: (unit: PrecipUnit) => void;
	setPressureUnit: (unit: PressureUnit) => void;
	setTheme: (theme: ThemePreference) => void;
}

export const usePreferences = create<PreferencesState>()(
	persist(
		(set) => ({
			temperatureUnit: 'f',
			windUnit: 'mph',
			precipUnit: 'in',
			pressureUnit: 'hPa',
			theme: 'system',
			setTemperatureUnit: (unit) => set({ temperatureUnit: unit }),
			setWindUnit: (unit) => set({ windUnit: unit }),
			setPrecipUnit: (unit) => set({ precipUnit: unit }),
			setPressureUnit: (unit) => set({ pressureUnit: unit }),
			setTheme: (theme) => set({ theme }),
		}),
		{ name: 'prefs' }
	)
);
