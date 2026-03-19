import React from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';
import { formatTemp } from '@/lib/formatters';
import { usePreferences } from '@/store/usePreferences';

const FeelsLikeCard: React.FC = () => {
	const { lat, lon } = useLocation();
	const { forecast } = useWeatherData(lat, lon);
	const { temperatureUnit } = usePreferences();
	const cur = forecast.data?.current;

	// API always returns temperature in Celsius
	const feelsC = cur?.apparent_temperature ?? null;
	const actualC = cur?.temperature_2m ?? null;

	let reason = '—';
	if (cur && feelsC != null && actualC != null) {
		const diff = feelsC - actualC;
		const wind = cur.wind_speed_10m ?? 0;
		const hum = cur.relative_humidity_2m ?? 0;

		if (Math.abs(diff) < 1) {
			reason = 'Similar to actual';
		} else if (diff < 0 && wind > 8) {
			reason = 'Wind makes it feel cooler';
		} else if (diff > 0 && hum > 70) {
			reason = 'Humidity makes it feel warmer';
		} else if (diff < 0) {
			reason = 'Feels cooler';
		} else {
			reason = 'Feels warmer';
		}
	}

	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10">
			<div className="text-sm text-slate-300">Feels Like</div>
			{forecast.isLoading ? (
				<div className="mt-3 h-8 rounded bg-white/10 animate-pulse" />
			) : forecast.isError ? (
				<div className="mt-3 text-sm text-red-300">Failed to load</div>
			) : (
				<>
					<div className="mt-3 text-2xl font-medium">{feelsC != null ? formatTemp(feelsC, temperatureUnit) : '—'}</div>
					<div className="mt-1 text-xs text-slate-400">{reason}</div>
				</>
			)}
		</div>
	);
};

export default FeelsLikeCard;