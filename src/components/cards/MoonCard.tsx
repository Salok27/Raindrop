import React, { useMemo } from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';

// Approximate moonrise/moonset calculation
function calculateMoonTimes(lat: number, lon: number, date: Date = new Date()) {
	const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);

	// Moon rises approximately 50 minutes later each day
	const baseRise = 6 + (dayOfYear * 0.83) % 24;
	const baseSet = baseRise + 12;

	const lonAdjust = lon / 15;
	const timezoneOffset = date.getTimezoneOffset() / 60;

	let moonrise = baseRise - lonAdjust - timezoneOffset;
	let moonset = baseSet - lonAdjust - timezoneOffset;

	// Normalize to 24-hour format
	if (moonrise < 0) moonrise += 24;
	if (moonrise >= 24) moonrise -= 24;
	if (moonset < 0) moonset += 24;
	if (moonset >= 24) moonset -= 24;

	const formatTime = (hours: number) => {
		const h = Math.floor(hours);
		const m = Math.floor((hours - h) * 60);
		return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
	};

	return {
		rise: formatTime(moonrise),
		set: formatTime(moonset)
	};
}

const MoonCard: React.FC = () => {
	const { lat, lon } = useLocation();
	const { moonPhaseName } = useWeatherData(lat, lon);

	const moonTimes = useMemo(() => {
		if (lat != null && lon != null) {
			return calculateMoonTimes(lat, lon);
		}
		return { rise: null, set: null };
	}, [lat, lon]);

	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10">
			<div className="text-sm text-slate-300">Moon</div>
			<div className="mt-3 text-sm">
				<div className="text-slate-200">{moonPhaseName}</div>
				<div className="text-xs text-slate-400 mt-1">
					Rise {moonTimes.rise || '—'} • Set {moonTimes.set || '—'}
				</div>
			</div>
		</div>
	);
};

export default MoonCard;