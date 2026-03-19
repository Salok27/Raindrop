import React from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';
import { usePreferences } from '@/store/usePreferences';

const VisibilityCard: React.FC = () => {
	const { lat, lon } = useLocation();
	const { forecast } = useWeatherData(lat, lon);
	const { windUnit } = usePreferences();
	const visM = forecast.data?.current?.visibility ?? null;
	const isImperial = windUnit === 'mph';
	const vis = visM != null ? (isImperial ? visM / 1609.34 : visM / 1000) : null;
	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10">
			<div className="text-sm text-slate-300">Visibility</div>
			{forecast.isLoading ? (
				<div className="mt-3 h-8 rounded bg-white/10 animate-pulse" />
			) : forecast.isError ? (
				<div className="mt-3 text-sm text-red-300">Failed to load</div>
			) : (
				<div className="mt-3 text-2xl font-medium">{vis != null ? `${vis.toFixed(1)} ${isImperial ? 'mi' : 'km'}` : '—'}</div>
			)}
		</div>
	);
};

export default VisibilityCard;
