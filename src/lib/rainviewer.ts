export interface RainviewerFrame {
	time: number;
	path: string;
	host?: string;
}

export interface RainviewerResponse {
	generated: number;
	host: string;
	radar: { past: RainviewerFrame[]; nowcast: RainviewerFrame[] };
	satellite?: { past: RainviewerFrame[]; nowcast: RainviewerFrame[] };
}

export async function fetchRainviewer(): Promise<RainviewerResponse> {
	const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
	if (!res.ok) throw new Error(`rainviewer ${res.status}`);
	return (await res.json()) as RainviewerResponse;
}

export function tileUrl(host: string, framePath: string, z: number, x: number, y: number): string {
	return `${host}/v2/radar/${framePath}/256/${z}/${x}/${y}/2/1_1.png`;
}

export function satelliteTileUrl(host: string, framePath: string, z: number, x: number, y: number): string {
	return `${host}/v2/satellite/${framePath}/256/${z}/${x}/${y}/2/1_0.png`;
}
