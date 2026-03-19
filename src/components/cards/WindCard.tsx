import React from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';
import { usePreferences } from '@/store/usePreferences';
import { formatWind, windDirectionToCompass, msTo } from '@/lib/formatters';

const Gauge: React.FC<{ speedMs?: number | null; gustMs?: number | null; deg?: number | null; unit: 'kmh' | 'ms' | 'mph' }>
= ({ speedMs, gustMs, deg, unit }) => {
	const r = 34; // ring radius
	const cx = 40, cy = 40; // center
	const angle = ((deg ?? 0) - 90) * (Math.PI / 180);
	const dotX = cx + r * Math.cos(angle);
	const dotY = cy + r * Math.sin(angle);
	const ticks = Array.from({ length: 36 }).map((_, i) => i * 10);
	const speed = speedMs != null ? Math.round(msTo(unit, speedMs)) : null;
	const gust = gustMs != null ? Math.round(msTo(unit, gustMs)) : null;
	const unitLabel = unit === 'ms' ? 'm/s' : unit;
	return (
		<svg width={80} height={80} viewBox="0 0 80 80" aria-label="Wind gauge">
			<defs>
				<linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stopColor="#38bdf8" />
					<stop offset="100%" stopColor="#0284c7" />
				</linearGradient>
			</defs>
			<circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
			{ticks.map((a, i) => {
				const rad = (a - 90) * (Math.PI / 180);
				const inner = r - (i % 3 === 0 ? 8 : 4);
				const x1 = cx + (r - 1) * Math.cos(rad);
				const y1 = cy + (r - 1) * Math.sin(rad);
				const x2 = cx + inner * Math.cos(rad);
				const y2 = cy + inner * Math.sin(rad);
				return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />;
			})}
			{/* direction pointer */}
			<line x1={cx} y1={cy} x2={dotX} y2={dotY} stroke="url(#g)" strokeWidth={3} strokeLinecap="round" />
			<circle cx={dotX} cy={dotY} r={3} fill="white" />
			{/* labels */}
			<text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="700" fill="white">{speed ?? '—'}</text>
			<text x={cx} y={cy + 10} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.85)">{unitLabel}</text>
			<text x={cx} y={14} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.6)">N</text>
			<text x={cx} y={76} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.6)">S</text>
			<text x={8} y={cy + 3} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.6)">W</text>
			<text x={72} y={cy + 3} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.6)">E</text>
			{gust != null && (
				<text x={cx} y={cy + 24} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.6)">gust {gust} {unitLabel}</text>
			)}
		</svg>
	);
};

const WindCard: React.FC = () => {
	const { lat, lon } = useLocation();
	const { forecast } = useWeatherData(lat, lon);
	const { windUnit } = usePreferences();
	const cur = forecast.data?.current;
	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10">
			<div className="text-sm text-slate-300">Wind</div>
			{forecast.isLoading ? (
				<div className="mt-3 h-28 rounded bg-white/10 animate-pulse" />
			) : forecast.isError ? (
				<div className="mt-3 text-sm text-red-300">Failed to load</div>
			) : (
				<div className="mt-3 flex items-center gap-4">
					<Gauge speedMs={cur?.wind_speed_10m ?? null} gustMs={cur?.wind_gusts_10m ?? null} deg={cur?.wind_direction_10m ?? null} unit={windUnit} />
					<div className="text-sm text-slate-300">
						<div>
							<span className="text-slate-400">Direction</span>
							<div className="text-base text-white">{cur?.wind_direction_10m != null ? `${windDirectionToCompass(cur.wind_direction_10m)} ${Math.round(cur.wind_direction_10m)}°` : '—'}</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default WindCard;
