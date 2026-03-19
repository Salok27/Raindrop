import React from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';
import { formatTimeShort } from '@/lib/formatters';

const SunCard: React.FC = () => {
	const { lat, lon } = useLocation();
	const { forecast } = useWeatherData(lat, lon);

	// Sunrise/sunset comes from main forecast API
	const sunrise = forecast.data?.daily?.sunrise?.[0];
	const sunset = forecast.data?.daily?.sunset?.[0];

	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10">
			<div className="text-sm text-slate-300">Sunrise / Sunset</div>
			{forecast.isLoading ? (
				<div className="mt-3 h-16 rounded bg-white/10 animate-pulse" />
			) : (
				<div className="mt-3 flex justify-between text-sm">
					<div>Sunrise <span className="text-slate-300">{sunrise ? formatTimeShort(sunrise) : '—'}</span></div>
					<div>Sunset <span className="text-slate-300">{sunset ? formatTimeShort(sunset) : '—'}</span></div>
				</div>
			)}
		</div>
	);
};

export default SunCard;