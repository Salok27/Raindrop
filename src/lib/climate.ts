import { z } from 'zod';

export const ClimateNormalsSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
	daily: z.object({
		time: z.array(z.string()),
		temperature_2m_mean: z.array(z.number().nullable()).optional(),
		temperature_2m_max: z.array(z.number().nullable()).optional(),
		temperature_2m_min: z.array(z.number().nullable()).optional(),
		precipitation_sum: z.array(z.number().nullable()).optional()
	}).optional()
});

export type ClimateNormalsResponse = z.infer<typeof ClimateNormalsSchema>;

const climateCache = new Map<string, { data: ClimateNormalsResponse; timestamp: number }>();
const CACHE_DURATION = 3600000;

export async function fetchClimateNormals(lat: number, lon: number): Promise<ClimateNormalsResponse> {
	const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
	const cached = climateCache.get(cacheKey);
	
	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		return cached.data;
	}

	const estimatedTemp = getEstimatedTemperature(lat);
	
	const result: ClimateNormalsResponse = {
		latitude: lat,
		longitude: lon,
		daily: {
			time: [new Date().toISOString().split('T')[0]],
			temperature_2m_mean: [estimatedTemp],
			temperature_2m_max: [estimatedTemp + 5],
			temperature_2m_min: [estimatedTemp - 5],
			precipitation_sum: [2.5]
		}
	};
	
	climateCache.set(cacheKey, { data: result, timestamp: Date.now() });
	return result;
}

function getEstimatedTemperature(lat: number): number {
	const now = new Date();
	const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
	const baseTemp = 25 - Math.abs(lat) * 0.5;
	const seasonalVariation = 15 * Math.cos((dayOfYear - 172) * 2 * Math.PI / 365);
	const adjustedSeasonal = lat >= 0 ? seasonalVariation : -seasonalVariation;
	return Math.round(baseTemp + adjustedSeasonal);
}

export function calculateAverage(values: (number | null)[]): number | null {
	const filtered = values.filter((v): v is number => v != null);
	if (filtered.length === 0) return null;
	return filtered.reduce((sum, v) => sum + v, 0) / filtered.length;
}
