import { z } from 'zod';

export const CurrentSchema = z.object({
	time: z.string(),
	temperature_2m: z.number().nullable().optional(),
	apparent_temperature: z.number().nullable().optional(),
	relative_humidity_2m: z.number().nullable().optional(),
	wind_speed_10m: z.number().nullable().optional(),
	wind_gusts_10m: z.number().nullable().optional(),
	wind_direction_10m: z.number().nullable().optional(),
	precipitation: z.number().nullable().optional(),
	rain: z.number().nullable().optional(),
	snowfall: z.number().nullable().optional(),
	cloud_cover: z.number().nullable().optional(),
	surface_pressure: z.number().nullable().optional(),
	visibility: z.number().nullable().optional(),
	is_day: z.number().nullable().optional(),
	weather_code: z.number().nullable().optional()
});

export const ForecastSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
	timezone: z.string(),
	current: CurrentSchema.optional(),
	hourly: z.object({
		time: z.array(z.string()),
		weather_code: z.array(z.number().nullable()).optional(),
		is_day: z.array(z.number().nullable()).optional(),
		temperature_2m: z.array(z.number().nullable()).optional(),
		apparent_temperature: z.array(z.number().nullable()).optional(),
		precipitation: z.array(z.number().nullable()).optional(),
		precipitation_probability: z.array(z.number().nullable()).optional(),
		rain: z.array(z.number().nullable()).optional(),
		snowfall: z.array(z.number().nullable()).optional(),
		cloud_cover: z.array(z.number().nullable()).optional(),
		uv_index: z.array(z.number().nullable()).optional(),
		visibility: z.array(z.number().nullable()).optional(),
		wind_speed_10m: z.array(z.number().nullable()).optional(),
		wind_gusts_10m: z.array(z.number().nullable()).optional(),
		wind_direction_10m: z.array(z.number().nullable()).optional(),
		relative_humidity_2m: z.array(z.number().nullable()).optional(),
		surface_pressure: z.array(z.number().nullable()).optional()
	}).optional(),
	daily: z.object({
		time: z.array(z.string()),
		temperature_2m_max: z.array(z.number().nullable()).optional(),
		temperature_2m_min: z.array(z.number().nullable()).optional(),
		precipitation_sum: z.array(z.number().nullable()).optional(),
		precipitation_probability_max: z.array(z.number().nullable()).optional(),
		sunrise: z.array(z.string().nullable()).optional(),
		sunset: z.array(z.string().nullable()).optional(),
		uv_index_max: z.array(z.number().nullable()).optional(),
		wind_speed_10m_max: z.array(z.number().nullable()).optional(),
		weather_code: z.array(z.number().nullable()).optional()
	}).optional()
});

export type ForecastResponse = z.infer<typeof ForecastSchema>;

export async function fetchForecast(params: Record<string, string | number | boolean>): Promise<ForecastResponse> {
	const url = new URL('https://api.open-meteo.com/v1/forecast');
	Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
	const res = await fetch(url.toString());
	if (!res.ok) throw new Error(`forecast ${res.status}`);
	return ForecastSchema.parse(await res.json());
}

export const AirQualitySchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
	current: z.object({
		time: z.string(),
		us_aqi: z.number().nullable().optional(),
		pm2_5: z.number().nullable().optional(),
		pm10: z.number().nullable().optional(),
		european_aqi: z.number().nullable().optional(),
	}).optional(),
	hourly: z.object({
		time: z.array(z.string()),
		us_aqi: z.array(z.number().nullable()).optional(),
		pm2_5: z.array(z.number().nullable()).optional(),
		pm10: z.array(z.number().nullable()).optional(),
	}).optional()
});

export type AirQualityResponse = z.infer<typeof AirQualitySchema>;

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityResponse> {
	const url = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
	url.searchParams.set('latitude', lat.toString());
	url.searchParams.set('longitude', lon.toString());
	url.searchParams.set('current', 'us_aqi,pm2_5,pm10,european_aqi');
	url.searchParams.set('timezone', 'auto');
	const res = await fetch(url.toString());
	if (!res.ok) throw new Error(`air ${res.status}`);
	return AirQualitySchema.parse(await res.json());
}

export function calculateMoonPhase(date: Date = new Date()): number {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const c = Math.floor((year - 2000) * 365.25);
	const e = Math.floor((month - 1) * 30.6);
	const jd = c + e + day - 694039.09;
	const phase = jd / 29.53058867;
	return phase - Math.floor(phase);
}

export function getMoonPhaseName(phase: number): string {
	if (phase < 0.03 || phase >= 0.97) return 'New Moon';
	if (phase < 0.22) return 'Waxing Crescent';
	if (phase < 0.28) return 'First Quarter';
	if (phase < 0.47) return 'Waxing Gibbous';
	if (phase < 0.53) return 'Full Moon';
	if (phase < 0.72) return 'Waning Gibbous';
	if (phase < 0.78) return 'Last Quarter';
	return 'Waning Crescent';
}
