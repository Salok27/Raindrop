import React from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';
import { dewPointC, formatTemp } from '@/lib/formatters';
import { usePreferences } from '@/store/usePreferences';

const HumidityCard: React.FC = () => {
	const { lat, lon } = useLocation();
	const { forecast } = useWeatherData(lat, lon);
	const { temperatureUnit } = usePreferences();
	const cur = forecast.data?.current;

	// API returns temperature in Celsius
	const tempC = cur?.temperature_2m ?? null;
	const humidity = cur?.relative_humidity_2m ?? null;
	const dew = tempC != null && humidity != null
		? dewPointC(tempC, humidity)
		: null;

	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10">
			<div className="text-sm text-slate-300">Humidity</div>
			{forecast.isLoading ? (
				<div className="mt-3 h-8 rounded bg-white/10 animate-pulse" />
			) : forecast.isError ? (
				<div className="mt-3 text-sm text-red-300">Failed to load</div>
			) : (
				<div className="mt-3 flex items-baseline gap-3">
					<div className="text-3xl font-semibold">
						{cur?.relative_humidity_2m != null ? `${Math.round(cur.relative_humidity_2m)}%` : '—'}
					</div>
					<div className="text-slate-300">Dew {dew != null ? formatTemp(dew, temperatureUnit) : '—'}</div>
				</div>
			)}
		</div>
	);
};

export default HumidityCard;
