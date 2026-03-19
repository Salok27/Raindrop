import React from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';
import { aqiUSDescriptor } from '@/lib/formatters';
import { getOverallAQI, getAQICategory, getAQICategoryColor } from '@/lib/airnow';

const AirQualityCard: React.FC = () => {
	const { lat, lon } = useLocation();
	const { air, airNow } = useWeatherData(lat, lon);

	// Prefer AirNow data, fallback to Open-Meteo (current then hourly)
	const airNowAQI = airNow?.data ? getOverallAQI(airNow.data) : null;
	const openMeteoAQI = air?.data?.current?.us_aqi ?? air?.data?.hourly?.us_aqi?.[0] ?? null;

	const aqi = airNowAQI ?? openMeteoAQI;
	const dataSource = airNowAQI ? 'AirNow' : 'Open-Meteo';
	const isLoading = (airNow?.isLoading && air?.isLoading) ?? false;
	const hasError = (airNow?.isError && air?.isError) ?? false;
	const showUnavailable = hasError || aqi == null;
	const categoryColor = aqi != null ? getAQICategoryColor(aqi) : 'transparent';

	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10">
			<div className="flex items-center justify-between">
				<div className="text-sm text-slate-300">Air Quality</div>
				<div className="flex items-center gap-2">
					{aqi != null && (
						<div className="text-xs text-slate-400">via {dataSource}</div>
					)}
					{hasError && (
						<button
							className="text-xs text-sky-300 hover:underline"
							onClick={() => {
								airNow?.refetch();
								air?.refetch();
							}}
						>
							Retry
						</button>
					)}
				</div>
			</div>
			{isLoading ? (
				<div className="mt-3 h-8 rounded bg-white/10 animate-pulse" />
			) : (
				<div className="mt-3 flex items-center gap-3">
					<div className="flex items-baseline gap-3">
						<div className="text-3xl font-semibold">{aqi ?? '—'}</div>
						<div className="text-slate-300">
							{showUnavailable ? 'Unavailable' : (airNowAQI ? getAQICategory(aqi!) : aqiUSDescriptor(aqi!))}
						</div>
					</div>
					{aqi != null && (
						<div
							className="w-3 h-3 rounded-full flex-shrink-0"
							style={{ backgroundColor: categoryColor }}
							title={`AQI ${aqi} - ${airNowAQI ? getAQICategory(aqi) : aqiUSDescriptor(aqi)}`}
						/>
					)}
				</div>
			)}
			{airNow?.data && airNow.data.length > 0 && (
				<div className="mt-2 text-xs text-slate-400">
					{airNow.data[0]?.ReportingArea || 'Unknown'}
				</div>
			)}
		</div>
	);
};

export default AirQualityCard;