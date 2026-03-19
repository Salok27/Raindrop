import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useWeatherData } from '@/hooks/useWeatherData';
import { useLocation } from '@/store/useLocation';

// Component to update map center when coordinates change
function MapUpdater({ center }: { center: [number, number] }) {
	const map = useMap();
	useEffect(() => {
		map.setView(center, map.getZoom(), { animate: true });
	}, [center, map]);
	return null;
}

function RainviewerOverlay({ framePath, host }: { framePath: string; host: string }) {
	const map = useMap();
	const layerRef = useRef<L.TileLayer | null>(null);
	useEffect(() => {
		if (layerRef.current) {
			map.removeLayer(layerRef.current);
			layerRef.current = null;
		}
		const layer = L.tileLayer(`${host}/v2/radar/${framePath}/256/{z}/{x}/{y}/2/1_1.png`, {
			opacity: 0.6,
			attribution: 'RainViewer'
		});
		layer.addTo(map);
		layerRef.current = layer;
		return () => {
			if (layerRef.current) map.removeLayer(layerRef.current);
		};
	}, [framePath, host, map]);
	return null;
}

const RadarMap: React.FC = () => {
	const { lat, lon, name } = useLocation();
	const { rain } = useWeatherData(lat, lon);

	// Call ALL hooks first - before any returns
	const frames = useMemo(() => rain.data ? [...(rain.data.radar.past ?? []), ...(rain.data.radar.nowcast ?? [])] : [], [rain.data]);
	const [ix, setIx] = useState(Math.max(0, frames.length - 1));
	const [playing, setPlaying] = useState(false);

	useEffect(() => {
		setIx(Math.max(0, frames.length - 1));
	}, [frames.length]);

	useEffect(() => {
		if (!playing || frames.length === 0) return;
		const t = setInterval(() => setIx((i) => (i + 1) % frames.length), 700);
		return () => clearInterval(t);
	}, [playing, frames.length]);

	const center: [number, number] = [lat ?? 37.323, lon ?? -122.032];

	return (
		<div className="w-full rounded-xl overflow-hidden border border-white/10">
			<div className="relative">
				<MapContainer center={center} zoom={7} style={{ height: 320, width: '100%' }} scrollWheelZoom={false}>
					<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
					<MapUpdater center={center} />
					{rain.data && frames[ix] && (
						<RainviewerOverlay framePath={frames[ix].path} host={rain.data.host} />
					)}
					{/* City location marker */}
					<CircleMarker
						center={center}
						radius={8}
						pathOptions={{
							fillColor: '#3b82f6',
							fillOpacity: 0.9,
							color: '#ffffff',
							weight: 2,
						}}
					>
						{name && (
							<Popup>
								<span className="font-medium text-slate-800">{name}</span>
							</Popup>
						)}
					</CircleMarker>
				</MapContainer>
				<div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/40 backdrop-blur rounded-md px-2 py-1 text-xs">
					<button className="px-2 py-1 rounded bg-white/10" onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</button>
					<span>{frames.length ? new Date(frames[ix].time * 1000).toLocaleTimeString() : '—'}</span>
				</div>
			</div>
		</div>
	);
};

export default RadarMap;
