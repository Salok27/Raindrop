import { useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import CurrentSummary from '@/components/CurrentSummary';
import SearchBox from '@/components/SearchBox';
import UnitToggle from '@/components/UnitToggle';
import ForecastRow from '@/components/ForecastRow';
import RadarMap from '@/components/RadarMap';
import WeatherChat from '@/components/WeatherChat';
import { iconForWeatherCode } from '@/lib/icons';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';
import { weatherCodeToText } from '@/lib/weatherCodes';
import { formatDayLabel, formatTemp } from '@/lib/formatters';
import { usePreferences } from '@/store/usePreferences';
import {
	AirQualityCard,
	WindCard,
	PrecipitationCard,
	UVCard,
	SunCard,
	FeelsLikeCard,
	MoonCard,
	HumidityCard,
	VisibilityCard,
	PressureCard,
	AveragesCard,
	InsightCard
} from '@/components/cards';

const DEFAULT_LOCATION = {
	lat: 40.7128,
	lon: -74.006,
	name: 'New York'
};

const App = () => {
	const { lat, lon, name, setLocation, _hasHydrated } = useLocation();
	const { temperatureUnit } = usePreferences();

	useEffect(() => {
		if (!_hasHydrated) return;
		if (lat != null && lon != null) return;
		setLocation(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon, DEFAULT_LOCATION.name);
	}, [_hasHydrated, lat, lon, setLocation]);

	const { forecast } = useWeatherData(lat, lon);

	const current = forecast.data?.current;
	const cityLabel = name ?? 'Search a city';
	const temp = current?.temperature_2m != null ? formatTemp(current.temperature_2m!, temperatureUnit) : '—';
	const desc = current?.weather_code != null ? weatherCodeToText(current.weather_code, (current.is_day ?? 1) === 1) : 'Loading…';
	const IconToday = iconForWeatherCode(current?.weather_code ?? 1, (current?.is_day ?? 1) === 1);
	const daily = forecast.data?.daily;

	const minAll = useMemo(() => {
		const arr = (daily?.temperature_2m_min ?? []).filter((v): v is number => v != null);
		return arr.length ? Math.min(...arr) : 0;
	}, [daily?.temperature_2m_min]);

	const maxAll = useMemo(() => {
		const arr = (daily?.temperature_2m_max ?? []).filter((v): v is number => v != null);
		return arr.length ? Math.max(...arr) : 1;
	}, [daily?.temperature_2m_max]);

	const dailyIconAt = (i: number) => {
		const dailyCode = daily?.weather_code?.[i];
		if (dailyCode != null) return iconForWeatherCode(dailyCode, true) as any;
		const hourlyCodes = forecast.data?.hourly?.weather_code;
		const hourlyDay = forecast.data?.hourly?.is_day;
		if (!hourlyCodes || !hourlyDay) return IconToday as any;
		const idx = i * 24 + 12;
		const code = hourlyCodes[idx] ?? current?.weather_code ?? 1;
		const isDay = (hourlyDay[idx] ?? 1) === 1;
		return iconForWeatherCode(code ?? 1, isDay) as any;
	};

	if (lat == null || lon == null) {
		return (
			<div className="min-h-screen text-white flex items-center justify-center bg-slate-900">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
					<div className="text-xl mb-2">Loading weather data...</div>
					<div className="text-sm text-slate-400">Detecting your location</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen text-white bg-gradient-to-b from-slate-900 to-slate-800">
			<div className="max-w-6xl mx-auto px-4 py-4">
				{/* Header bar */}
				<div className="flex items-center justify-between gap-4 mb-4">
					<SearchBox />
					<UnitToggle />
				</div>

				{/* Current weather hero */}
				<div className="rounded-2xl bg-gradient-to-br from-blue-600/30 to-purple-600/20 border border-white/10 p-6 mb-4">
					<Header city={cityLabel} temp={temp} desc={desc} />
					<div className="mt-4 max-w-md mx-auto">
						<CurrentSummary
							code={current?.weather_code ?? null}
							isDay={(current?.is_day ?? 1) === 1}
							min={daily?.temperature_2m_min?.[0] ?? null}
							max={daily?.temperature_2m_max?.[0] ?? null}
							current={current?.temperature_2m ?? null}
						/>
					</div>
				</div>

				{/* Main content - 2 columns on desktop */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Left column */}
					<div className="space-y-4">
						{/* Map */}
						<RadarMap />
						
						{/* AI Chat */}
						<WeatherChat />

						{/* 7-Day Forecast */}
						<div className="rounded-xl bg-white/5 border border-white/10 p-4">
							<div className="text-xs uppercase tracking-wide text-slate-400 mb-3 font-medium">
								7-Day Forecast
							</div>
							{(daily?.time && daily.time.length) ? (
								<div className="divide-y divide-white/10">
									{daily.time.slice(0, 7).map((t, i) => (
										<ForecastRow
											key={i}
											dayLabel={formatDayLabel(t, i)}
											Icon={dailyIconAt(i)}
											min={daily.temperature_2m_min?.[i] ?? 0}
											max={daily.temperature_2m_max?.[i] ?? 0}
											minAll={minAll}
											maxAll={maxAll}
											precipPct={daily.precipitation_probability_max?.[i] ?? undefined}
										/>
									))}
								</div>
							) : forecast.isError ? (
								<div className="text-sm text-red-300 py-4">Failed to load</div>
							) : (
								<div className="space-y-2">
									{Array.from({ length: 7 }).map((_, i) => (
										<div key={i} className="h-8 rounded bg-white/10 animate-pulse" />
									))}
								</div>
							)}
						</div>
					</div>

					{/* Right column - Weather details */}
					<div className="grid grid-cols-2 gap-3 content-start">
						<AirQualityCard />
						<WindCard />
						<SunCard />
						<MoonCard />
						<FeelsLikeCard />
						<HumidityCard />
						<PrecipitationCard />
						<UVCard />
						<VisibilityCard />
						<PressureCard />
						<div className="col-span-2">
							<AveragesCard />
						</div>
						<div className="col-span-2">
							<InsightCard />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
