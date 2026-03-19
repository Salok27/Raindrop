import React from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';
import { usePreferences } from '@/store/usePreferences';
import { formatPressure } from '@/lib/formatters';

const PressureCard: React.FC = () => {
	const { lat, lon } = useLocation();
	const { forecast } = useWeatherData(lat, lon);
	const { pressureUnit } = usePreferences();
	const hpa = forecast.data?.current?.surface_pressure ?? null;
	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10">
			<div className="text-sm text-slate-300">Pressure</div>
			{forecast.isLoading ? (
				<div className="mt-3 h-8 rounded bg-white/10 animate-pulse" />
			) : forecast.isError ? (
				<div className="mt-3 text-sm text-red-300">Failed to load</div>
			) : (
				<div className="mt-3 text-2xl font-medium">{hpa != null ? formatPressure(hpa, pressureUnit) : '—'}</div>
			)}
		</div>
	);
};

export default PressureCard;
