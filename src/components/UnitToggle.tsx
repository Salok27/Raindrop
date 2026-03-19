// import React from 'react';
import { usePreferences } from '@/store/usePreferences';

const UnitToggle: React.FC = () => {
	const { temperatureUnit, setTemperatureUnit, windUnit, setWindUnit } = usePreferences();
	return (
		<div className="flex gap-3 items-center">
			<div className="flex items-center gap-2">
				<span className="text-xs text-slate-300">Temp</span>
				<div className="inline-flex rounded-lg overflow-hidden border border-white/10">
					<button
						className={`px-2 py-1 text-xs ${temperatureUnit === 'f' ? 'bg-white/20' : 'bg-transparent'}`}
						onClick={() => setTemperatureUnit('f')}
					>
						°F
					</button>
					<button
						className={`px-2 py-1 text-xs ${temperatureUnit === 'c' ? 'bg-white/20' : 'bg-transparent'}`}
						onClick={() => setTemperatureUnit('c')}
					>
						°C
					</button>
				</div>
			</div>
			<div className="flex items-center gap-2">
				<span className="text-xs text-slate-300">Wind</span>
				<div className="inline-flex rounded-lg overflow-hidden border border-white/10">
					{(['mph','kmh','ms'] as const).map((u) => (
						<button key={u} className={`px-2 py-1 text-xs ${windUnit === u ? 'bg-white/20' : 'bg-transparent'}`} onClick={() => setWindUnit(u)}>
							{u}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default UnitToggle;
