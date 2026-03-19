import React, { useMemo } from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';
import { usePreferences } from '@/store/usePreferences';
import { formatPrecip } from '@/lib/formatters';

const PrecipitationCard: React.FC = () => {
	const { lat, lon } = useLocation();
	const { forecast } = useWeatherData(lat, lon);
	const { precipUnit } = usePreferences();
	const todayTotal = forecast.data?.daily?.precipitation_sum?.[0] ?? null;
	const nextHint = useMemo(() => {
		const probs = forecast.data?.hourly?.precipitation_probability;
		if (!probs) return '—';
		const idx = probs.findIndex((p) => (p ?? 0) >= 30);
		return idx >= 0 ? `Chance soon (${probs[idx]}%)` : 'None expected';
	}, [forecast.data?.hourly?.precipitation_probability]);

	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10">
			<div className="text-sm text-slate-300">Precipitation</div>
			{forecast.isLoading ? (
				<div className="mt-3 h-8 rounded bg-white/10 animate-pulse" />
			) : forecast.isError ? (
				<div className="mt-3 text-sm text-red-300">Failed to load</div>
			) : (
				<>
					<div className="mt-3 text-2xl font-medium">{todayTotal != null ? formatPrecip(todayTotal, precipUnit) : '—'}</div>
					<div className="mt-1 text-xs text-slate-400">{nextHint}</div>
				</>
			)}
		</div>
	);
};

export default PrecipitationCard;
