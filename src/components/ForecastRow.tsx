import React from 'react';
import { IconType } from 'react-icons';
import { usePreferences } from '@/store/usePreferences';
import { formatTemp, cToF } from '@/lib/formatters';

interface ForecastRowProps {
	dayLabel: string;
	Icon: IconType;
	min: number;      // Temperature in Celsius from API
	max: number;      // Temperature in Celsius from API
	minAll: number;   // Min of all days (Celsius)
	maxAll: number;   // Max of all days (Celsius)
	precipPct?: number;
}

function tempToHue(temp: number, minAll: number, maxAll: number): number {
	const span = Math.max(1, maxAll - minAll);
	const t = (temp - minAll) / span; // 0..1
	// 210 (cool blue) -> 35 (warm orange)
	return 210 - (210 - 35) * Math.min(1, Math.max(0, t));
}

const ForecastRow: React.FC<ForecastRowProps> = ({ dayLabel, Icon, min, max, minAll, maxAll, precipPct }) => {
	const { temperatureUnit } = usePreferences();

	// Keep bar calculations in Celsius for consistency
	const span = maxAll - minAll || 1;
	const left = ((min - minAll) / span) * 100;
	const right = 100 - ((max - minAll) / span) * 100;

	const hasPrecip = typeof precipPct === 'number' && !Number.isNaN(precipPct);
	const isZeroPrecip = hasPrecip && precipPct <= 0;
	const hueMin = tempToHue(min, minAll, maxAll);
	const hueMax = tempToHue(max, minAll, maxAll);
	const gradient = `linear-gradient(to right, hsl(${hueMin} 90% 60%), hsl(${hueMax} 90% 55%))`;

	// Convert for display
	const displayMin = temperatureUnit === 'f' ? cToF(min) : min;
	const displayMax = temperatureUnit === 'f' ? cToF(max) : max;
	const ariaPrecip = hasPrecip ? `, ${Math.round(precipPct)}% chance of precipitation` : '';

	return (
		<div className="grid grid-cols-[1fr_auto_auto_minmax(0,1fr)_auto] items-center gap-3 py-2 text-[13px]" aria-label={`${dayLabel}: low ${Math.round(displayMin)}°, high ${Math.round(displayMax)}°${ariaPrecip}`}>
			<div className="text-slate-200 font-medium">{dayLabel}</div>
			<div className="flex flex-col items-center -my-0.5" title={hasPrecip ? `${Math.round(precipPct)}% chance of precipitation` : 'Precipitation probability unavailable'}>
				<Icon className="text-2xl" />
				{hasPrecip && (
					<div className={`text-[11px] leading-3 ${isZeroPrecip ? 'text-slate-400' : 'text-sky-300 font-semibold'}`}>
						{Math.round(precipPct)}%
					</div>
				)}
			</div>
			<div className="text-slate-300 tabular-nums">{Math.round(displayMin)}°</div>
			<div className="h-2 rounded-full bg-white/10 relative" title={`Low ${Math.round(displayMin)}° — High ${Math.round(displayMax)}°`}>
				<div
					className="absolute top-0 bottom-0 rounded-full"
					style={{ left: `${left}%`, right: `${right}%`, background: gradient }}
				/>
			</div>
			<div className="text-slate-300 tabular-nums">{Math.round(displayMax)}°</div>
		</div>
	);
};

export default ForecastRow;
