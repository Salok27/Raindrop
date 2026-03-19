import React, { useMemo } from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';
import { usePreferences } from '@/store/usePreferences';
import { formatTemp } from '@/lib/formatters';
import { calculateAverage } from '@/lib/climate';

const AveragesCard: React.FC = () => {
	const { lat, lon } = useLocation();
	const { forecast, climate } = useWeatherData(lat, lon);
	const { temperatureUnit } = usePreferences();

	const currentTemp = forecast.data?.current?.temperature_2m ?? null;
	const todayPrecip = forecast.data?.daily?.precipitation_sum?.[0] ?? null;

	const climateData = useMemo(() => {
		if (!climate.data?.daily) return null;

		const avgTemp = calculateAverage(climate.data.daily.temperature_2m_mean ?? []);
		const avgPrecip = calculateAverage(climate.data.daily.precipitation_sum ?? []);

		return { avgTemp, avgPrecip };
	}, [climate.data]);

	const tempDiff = currentTemp != null && climateData?.avgTemp != null
		? currentTemp - climateData.avgTemp
		: null;

	const precipDiff = todayPrecip != null && climateData?.avgPrecip != null
		? todayPrecip - climateData.avgPrecip
		: null;

	const isLoading = forecast.isLoading || climate.isLoading;
	const hasError = forecast.isError || climate.isError;

	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10">
			<div className="text-sm text-slate-300">Averages vs Normal</div>
			{isLoading ? (
				<div className="mt-3 h-16 rounded bg-white/10 animate-pulse" />
			) : hasError ? (
				<div className="mt-3 text-sm text-red-300">Failed to load</div>
			) : (
				<div className="mt-3 space-y-2 text-sm">
					{/* Temperature comparison */}
					<div className="flex items-center justify-between">
						<span className="text-slate-400">Temperature</span>
						<div className="flex items-center gap-2">
							{currentTemp != null && climateData?.avgTemp != null ? (
								<>
									<span className="text-slate-300">
										{formatTemp(currentTemp, temperatureUnit)}
									</span>
									<span className={`text-xs font-semibold ${
										tempDiff! > 0 ? 'text-orange-400' : tempDiff! < 0 ? 'text-blue-400' : 'text-slate-400'
									}`}>
										{tempDiff! > 0 ? '+' : ''}{Math.round(tempDiff!)}°
									</span>
								</>
							) : (
								<span className="text-slate-400">—</span>
							)}
						</div>
					</div>

					{/* Precipitation comparison */}
					<div className="flex items-center justify-between">
						<span className="text-slate-400">Precipitation</span>
						<div className="flex items-center gap-2">
							{todayPrecip != null && climateData?.avgPrecip != null ? (
								<>
									<span className="text-slate-300">
										{todayPrecip.toFixed(1)} mm
									</span>
									<span className={`text-xs font-semibold ${
										precipDiff! > 0 ? 'text-sky-400' : precipDiff! < 0 ? 'text-slate-500' : 'text-slate-400'
									}`}>
										{precipDiff! > 0 ? '+' : ''}{precipDiff!.toFixed(1)}
									</span>
								</>
							) : (
								<span className="text-slate-400">—</span>
							)}
						</div>
					</div>

					<div className="text-xs text-slate-500 mt-2 pt-2 border-t border-white/10">
						vs. 30-year average <br />(1991-2020)
					</div>
				</div>
			)}
		</div>
	);
};

export default AveragesCard;