export function weatherCodeToText(code: number, isDay: boolean): string {
	// Simplified mapping for common codes
	switch (code) {
		case 0:
			return isDay ? 'Clear' : 'Clear Night';
		case 1:
			return isDay ? 'Mostly Sunny' : 'Mostly Clear';
		case 2:
			return 'Partly Cloudy';
		case 3:
			return 'Cloudy';
		case 45:
		case 48:
			return 'Fog';
		case 51:
		case 53:
		case 55:
		case 61:
		case 63:
		case 65:
		case 80:
		case 81:
		case 82:
			return 'Rain';
		case 71:
		case 73:
		case 75:
		case 77:
		case 85:
		case 86:
			return 'Snow';
		case 95:
			return 'Thunderstorm';
		case 96:
		case 99:
			return 'Thunder w/ hail';
		default:
			return '—';
	}
}
