import { z } from 'zod';

export const GeocodeResultSchema = z.object({
	results: z
		.array(
			z.object({
				id: z.number(),
				name: z.string(),
				latitude: z.number(),
				longitude: z.number(),
				country: z.string().optional(),
				admin1: z.string().optional(),
			})
		)
		.optional(),
});

export type GeocodeResult = z.infer<typeof GeocodeResultSchema>;

export async function geocodeCity(query: string, signal?: AbortSignal): Promise<GeocodeResult> {
	const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
	url.searchParams.set('name', query);
	url.searchParams.set('count', '10');
	url.searchParams.set('language', 'en');
	const res = await fetch(url.toString(), { signal });
	if (!res.ok) throw new Error(`geocode ${res.status}`);
	return GeocodeResultSchema.parse(await res.json());
}
