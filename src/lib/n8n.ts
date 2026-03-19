import type { WeatherContext } from './weatherContext';

export interface N8nChatResponse {
	message: string;
	suggestions?: string[];
}

export interface ChatMessage {
	role: 'user' | 'assistant';
	content: string;
	timestamp: number;
}

const isDev = import.meta.env.DEV;
const N8N_BASE = isDev ? '/api/n8n' : 'https://cov3rs.app.n8n.cloud';
const CHAT_URL = `${N8N_BASE}/webhook/weather-chat`;

function getSessionId(): string {
	const key = 'weather-chat-session';
	let id = localStorage.getItem(key);
	if (!id) {
		id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
		localStorage.setItem(key, id);
	}
	return id;
}

function formatWeatherForN8n(ctx: WeatherContext) {
	const forecast = ctx.forecast.slice(0, 7).map((day, i) => {
		const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : new Date(day.date).toLocaleDateString('en', { weekday: 'short' });
		return `${label}: ${Math.round(day.high)}°/${Math.round(day.low)}°C - ${day.condition} (${day.precipitationChance}% rain)`;
	}).join('\n');

	return {
		location: ctx.location.name,
		temperature: Math.round(ctx.current?.temperature ?? 0),
		feelsLike: Math.round(ctx.current?.feelsLike ?? 0),
		condition: ctx.current?.condition ?? 'Unknown',
		humidity: ctx.current?.humidity ?? 0,
		windSpeed: Math.round(ctx.current?.windSpeed ?? 0),
		precipitationChance: ctx.today?.precipitationChance ?? 0,
		uvIndex: ctx.today?.uvIndex ?? 0,
		airQuality: ctx.airQuality ? `${ctx.airQuality.aqi} (${ctx.airQuality.category})` : 'N/A',
		sunrise: formatTime(ctx.today?.sunrise),
		sunset: formatTime(ctx.today?.sunset),
		todayHigh: Math.round(ctx.today?.high ?? 0),
		todayLow: Math.round(ctx.today?.low ?? 0),
		forecast,
	};
}

function formatTime(iso?: string): string {
	if (!iso) return 'N/A';
	try {
		return new Date(iso).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false });
	} catch {
		return iso;
	}
}

export async function sendChatMessage(
	message: string,
	weatherContext: WeatherContext,
	_history: ChatMessage[]
): Promise<N8nChatResponse> {
	const defaultSuggestions = ['What should I wear?', 'Good for outdoor activities?', 'Will it rain?'];

	try {
		const res = await fetch(CHAT_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				sessionId: getSessionId(),
				message,
				weather: formatWeatherForN8n(weatherContext),
			})
		});

		if (!res.ok) {
			if (res.status === 404) {
				return { message: '⚠️ Service unavailable. Please try again later.', suggestions: ['Try again'] };
			}
			throw new Error(`Request failed: ${res.status}`);
		}

		const text = await res.text();
		if (!text?.trim()) {
			return { message: '⚠️ Empty response. Please try again.', suggestions: ['Try again'] };
		}

		try {
			const data = JSON.parse(text);
			if (typeof data === 'string') return { message: data, suggestions: defaultSuggestions };
			if (data.message) return { message: data.message, suggestions: data.suggestions || defaultSuggestions };
			if (data.output) return { message: data.output, suggestions: defaultSuggestions };
			if (Array.isArray(data) && data[0]) {
				return { message: data[0].output || data[0].message || JSON.stringify(data[0]), suggestions: defaultSuggestions };
			}
			return { message: JSON.stringify(data), suggestions: defaultSuggestions };
		} catch {
			return { message: text, suggestions: defaultSuggestions };
		}
	} catch (error) {
		return {
			message: `⚠️ Connection error: ${error instanceof Error ? error.message : 'Unknown'}`,
			suggestions: ['Try again'],
		};
	}
}

export function isChatEnabled(): boolean {
	return true;
}
