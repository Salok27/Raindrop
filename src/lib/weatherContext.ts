import type { ForecastResponse, AirQualityResponse } from './openmeteo';

export interface WeatherContext {
	location: { name: string; lat: number; lon: number };
	current: {
		temperature: number;
		feelsLike: number;
		humidity: number;
		windSpeed: number;
		windGusts: number;
		windDirection: number;
		precipitation: number;
		cloudCover: number;
		visibility: number;
		pressure: number;
		isDay: boolean;
		condition: string;
	} | null;
	today: {
		high: number;
		low: number;
		sunrise: string;
		sunset: string;
		precipitationChance: number;
		uvIndex: number;
	} | null;
	forecast: Array<{
		date: string;
		high: number;
		low: number;
		precipitationChance: number;
		condition: string;
	}>;
	airQuality: { aqi: number; category: string } | null;
}

function codeToCondition(code: number | null | undefined): string {
	if (code == null) return 'Unknown';
	if (code === 0) return 'Clear';
	if (code <= 3) return 'Partly Cloudy';
	if (code <= 49) return 'Foggy';
	if (code <= 59) return 'Drizzle';
	if (code <= 69) return 'Rain';
	if (code <= 79) return 'Snow';
	if (code <= 84) return 'Rain Showers';
	if (code <= 86) return 'Snow Showers';
	if (code <= 99) return 'Thunderstorm';
	return 'Unknown';
}

function aqiToCategory(aqi: number): string {
	if (aqi <= 50) return 'Good';
	if (aqi <= 100) return 'Moderate';
	if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
	if (aqi <= 200) return 'Unhealthy';
	if (aqi <= 300) return 'Very Unhealthy';
	return 'Hazardous';
}

export function buildWeatherContext(
	locationName: string,
	lat: number,
	lon: number,
	forecast: ForecastResponse | undefined,
	airQuality: AirQualityResponse | undefined
): WeatherContext {
	const current = forecast?.current;
	const daily = forecast?.daily;
	const aqi = airQuality?.current?.us_aqi ?? airQuality?.hourly?.us_aqi?.[0] ?? null;

	return {
		location: { name: locationName, lat, lon },
		current: current ? {
			temperature: current.temperature_2m ?? 0,
			feelsLike: current.apparent_temperature ?? 0,
			humidity: current.relative_humidity_2m ?? 0,
			windSpeed: current.wind_speed_10m ?? 0,
			windGusts: current.wind_gusts_10m ?? 0,
			windDirection: current.wind_direction_10m ?? 0,
			precipitation: current.precipitation ?? 0,
			cloudCover: current.cloud_cover ?? 0,
			visibility: current.visibility ?? 10000,
			pressure: current.surface_pressure ?? 1013,
			isDay: (current.is_day ?? 1) === 1,
			condition: codeToCondition(current.weather_code),
		} : null,
		today: daily ? {
			high: daily.temperature_2m_max?.[0] ?? 0,
			low: daily.temperature_2m_min?.[0] ?? 0,
			sunrise: daily.sunrise?.[0] ?? '',
			sunset: daily.sunset?.[0] ?? '',
			precipitationChance: daily.precipitation_probability_max?.[0] ?? 0,
			uvIndex: daily.uv_index_max?.[0] ?? 0,
		} : null,
		forecast: (daily?.time ?? []).slice(0, 7).map((date, i) => ({
			date,
			high: daily?.temperature_2m_max?.[i] ?? 0,
			low: daily?.temperature_2m_min?.[i] ?? 0,
			precipitationChance: daily?.precipitation_probability_max?.[i] ?? 0,
			condition: codeToCondition(daily?.weather_code?.[i]),
		})),
		airQuality: aqi != null ? { aqi, category: aqiToCategory(aqi) } : null,
	};
}
