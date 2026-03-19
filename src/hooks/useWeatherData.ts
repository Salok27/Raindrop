import { useQuery } from '@tanstack/react-query';
import { fetchForecast, fetchAirQuality, calculateMoonPhase, getMoonPhaseName } from '@/lib/openmeteo';
import { fetchRainviewer } from '@/lib/rainviewer';
import { fetchAirNowData } from '@/lib/airnow';
import { fetchClimateNormals } from '@/lib/climate';

export function useWeatherData(lat: number | null, lon: number | null) {
	const enabled = lat != null && lon != null;

	const forecast = useQuery({
		queryKey: ['forecast', lat, lon],
		enabled,
		queryFn: async () => {
			const hourly = 'weather_code,is_day,temperature_2m,apparent_temperature,precipitation,precipitation_probability,rain,snowfall,cloud_cover,uv_index,visibility,wind_speed_10m,wind_gusts_10m,wind_direction_10m,relative_humidity_2m,surface_pressure';
			const daily = 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,sunrise,sunset,uv_index_max,wind_speed_10m_max,weather_code';
			const current = 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,wind_direction_10m,precipitation,rain,snowfall,cloud_cover,surface_pressure,visibility,is_day,weather_code';
			return fetchForecast({
				latitude: lat!,
				longitude: lon!,
				hourly,
				daily,
				current,
				forecast_days: 10,
				timezone: 'auto',
				models: 'best_match',
			});
		}
	});

	const air = useQuery({
		queryKey: ['air', lat, lon],
		enabled,
		queryFn: () => fetchAirQuality(lat!, lon!),
		retry: 2,
		staleTime: 300_000,
	});

	const airNow = useQuery({
		queryKey: ['airnow', lat, lon],
		enabled,
		queryFn: () => fetchAirNowData(lat!, lon!),
		staleTime: 300_000,
		retry: 2
	});

	const rain = useQuery({
		queryKey: ['rainviewer'],
		staleTime: 60_000,
		queryFn: fetchRainviewer
	});

	const climate = useQuery({
		queryKey: ['climate', lat, lon],
		enabled,
		queryFn: () => fetchClimateNormals(lat!, lon!),
		staleTime: 86400_000,
		retry: 1
	});

	const moonPhase = calculateMoonPhase();
	const moonPhaseName = getMoonPhaseName(moonPhase);

	return { forecast, air, rain, airNow, climate, moonPhase, moonPhaseName };
}
