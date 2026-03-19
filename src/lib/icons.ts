import { WiDaySunny, WiNightClear, WiCloud, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog, WiDayCloudy, WiNightAltCloudy } from 'react-icons/wi';
import React from 'react';

export type IconComponent = React.ComponentType<{ className?: string }>;

export function iconForWeatherCode(code: number, isDay: boolean): IconComponent {
	if (code === 0) return isDay ? WiDaySunny : WiNightClear; // Clear
	if (code === 1) return isDay ? WiDaySunny : WiNightAltCloudy; // Mostly clear
	if (code === 2) return isDay ? WiDayCloudy : WiNightAltCloudy; // Partly cloudy
	if (code === 3) return WiCloudy; // Overcast
	if ([45, 48].includes(code)) return WiFog; // Fog
	if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return WiRain; // Rain
	if ([71, 73, 75, 77, 85, 86].includes(code)) return WiSnow; // Snow
	if ([95, 96, 99].includes(code)) return WiThunderstorm; // Thunder
	return WiCloud;
}
