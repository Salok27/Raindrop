import { z } from 'zod';

export const AirNowObservationSchema = z.object({
	DateObserved: z.string(),
	HourObserved: z.number(),
	LocalTimeZone: z.string(),
	ReportingArea: z.string(),
	StateCode: z.string(),
	Latitude: z.number(),
	Longitude: z.number(),
	ParameterName: z.string(),
	AQI: z.number(),
	CategoryNumber: z.number().optional(),
	CategoryName: z.string().optional()
});

export const AirNowResponseSchema = z.array(AirNowObservationSchema);

export type AirNowObservation = z.infer<typeof AirNowObservationSchema>;
export type AirNowResponse = z.infer<typeof AirNowResponseSchema>;

const API_KEY = import.meta.env.VITE_AIRNOW_API_KEY;

export async function fetchAirNowData(lat: number, lon: number): Promise<AirNowResponse> {
	if (!API_KEY) {
		throw new Error('AirNow API key not configured');
	}

	const url = new URL('https://www.airnowapi.org/aq/observation/latLong/current/');
	url.searchParams.set('format', 'application/json');
	url.searchParams.set('latitude', lat.toString());
	url.searchParams.set('longitude', lon.toString());
	url.searchParams.set('distance', '25'); // Search within 25 miles
	url.searchParams.set('API_KEY', API_KEY);

	const res = await fetch(url.toString());
	if (!res.ok) {
		throw new Error(`AirNow API error: ${res.status}`);
	}

	const data = await res.json();
	return AirNowResponseSchema.parse(data);
}

export function getOverallAQI(observations: AirNowResponse): number | null {
	if (!observations.length) return null;

	// Find the highest AQI value (worst air quality)
	return Math.max(...observations.map(obs => obs.AQI));
}

export function getAQICategory(aqi: number): string {
	if (aqi <= 50) return 'Good';
	if (aqi <= 100) return 'Moderate';
	if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
	if (aqi <= 200) return 'Unhealthy';
	if (aqi <= 300) return 'Very Unhealthy';
	return 'Hazardous';
}

export function getAQICategoryColor(aqi: number): string {
	if (aqi <= 50) return '#00e400'; // Green
	if (aqi <= 100) return '#ffff00'; // Yellow
	if (aqi <= 150) return '#ff7e00'; // Orange
	if (aqi <= 200) return '#ff0000'; // Red
	if (aqi <= 300) return '#8f3f97'; // Purple
	return '#7e0023'; // Maroon
}