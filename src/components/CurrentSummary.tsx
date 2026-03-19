import React from 'react';
import { usePreferences } from '@/store/usePreferences';
import { cToF } from '@/lib/formatters';

interface CurrentSummaryProps {
	code: number | null;
	isDay: boolean;
	min: number | null;
	max: number | null;
	current: number | null;
}

const CurrentSummary: React.FC<CurrentSummaryProps> = ({ min, max, current }) => {
	const { temperatureUnit } = usePreferences();

	// Calculate position based on Celsius values
	const pct = min != null && max != null && current != null && max > min
		? ((current - min) / (max - min)) * 100
		: 50;

	// Convert for display
	const displayMin = min != null ? (temperatureUnit === 'f' ? cToF(min) : min) : null;
	const displayMax = max != null ? (temperatureUnit === 'f' ? cToF(max) : max) : null;

	return (
		<div className="flex flex-col items-center w-full">
			<div className="flex items-center justify-between w-full text-xs text-slate-400 mb-1">
				<span>L: {displayMin != null ? `${Math.round(displayMin)}°` : '—'}</span>
				<span>H: {displayMax != null ? `${Math.round(displayMax)}°` : '—'}</span>
			</div>
			<div className="h-1.5 w-full bg-white/10 rounded-full relative overflow-hidden">
				{/* Temperature range gradient */}
				<div 
					className="absolute inset-y-0 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full opacity-60"
					style={{ 
						left: '0%', 
						right: '0%' 
					}}
				/>
				{/* Current temperature indicator */}
				<div 
					className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-lg border-2 border-white/50"
					style={{ left: `calc(${Math.max(5, Math.min(95, pct))}% - 5px)` }}
				/>
			</div>
		</div>
	);
};

export default CurrentSummary;
