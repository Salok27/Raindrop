import { TemperatureUnit, WindUnit, PrecipUnit, PressureUnit } from '@/store/usePreferences';
import { format, parseISO, isToday } from 'date-fns';

export function cToF(c: number): number {
	return (c * 9) / 5 + 32;
}

export function formatTemp(valueC: number, unit: TemperatureUnit): string {
	const v = unit === 'f' ? cToF(valueC) : valueC;
	return `${Math.round(v)}°`;
}

export function msTo(unit: WindUnit, ms: number): number {
	if (unit === 'ms') return ms;
	if (unit === 'kmh') return ms * 3.6;
	return ms * 2.236936; // mph
}

export function formatWind(ms: number, unit: WindUnit): string {
	const v = msTo(unit, ms);
	return `${Math.round(v)} ${unit}`;
}

export function mmToIn(mm: number): number {
	return mm / 25.4;
}

export function formatPrecip(mm: number, unit: PrecipUnit): string {
	const v = unit === 'in' ? mmToIn(mm) : mm;
	return `${v.toFixed(unit === 'in' ? 2 : 1)} ${unit}`;
}

export function hpaToInHg(hpa: number): number {
	return hpa * 0.0295299830714;
}

export function formatPressure(hpa: number, unit: PressureUnit): string {
	const v = unit === 'inHg' ? hpaToInHg(hpa) : hpa;
	return `${unit === 'inHg' ? v.toFixed(2) : Math.round(v)} ${unit}`;
}

export function windDirectionToCompass(deg: number): string {
	const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	const ix = Math.round(deg / 22.5) % 16;
	return dirs[ix];
}

export function aqiUSDescriptor(aqi: number): string {
	if (aqi == null || Number.isNaN(aqi)) return '—';
	if (aqi <= 50) return 'Good';
	if (aqi <= 100) return 'Moderate';
	if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
	if (aqi <= 200) return 'Unhealthy';
	if (aqi <= 300) return 'Very Unhealthy';
	return 'Hazardous';
}

export function dewPointC(tempC: number, humidityPct: number): number {
	// Magnus formula
	const a = 17.62;
	const b = 243.12;
	const gamma = (a * tempC) / (b + tempC) + Math.log(humidityPct / 100);
	return (b * gamma) / (a - gamma);
}

export function formatTimeShort(iso: string): string {
	try {
		return format(parseISO(iso), 'p');
	} catch {
		return iso;
	}
}

export function formatDayLabel(iso: string, index: number): string {
	try {
		const d = parseISO(iso);
		if (isToday(d)) return 'Today';
		return format(d, 'EEE');
	} catch {
		return index === 0 ? 'Today' : `Day ${index}`;
	}
}
