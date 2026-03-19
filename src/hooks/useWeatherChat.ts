import { useState, useCallback, useMemo } from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from './useWeatherData';
import { buildWeatherContext } from '@/lib/weatherContext';
import { sendChatMessage, ChatMessage } from '@/lib/n8n';

export function useWeatherChat() {
	const { lat, lon, name } = useLocation();
	const { forecast, air } = useWeatherData(lat, lon);
	
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Build weather context from current data
	const weatherContext = useMemo(() => {
		if (!lat || !lon || !name) return null;
		return buildWeatherContext(
			name,
			lat,
			lon,
			forecast.data,
			air.data
		);
	}, [lat, lon, name, forecast.data, air.data]);

	const sendMessage = useCallback(async (content: string) => {
		if (!weatherContext) {
			setError('Weather data not available');
			return;
		}

		const userMessage: ChatMessage = {
			role: 'user',
			content,
			timestamp: Date.now(),
		};

		setMessages(prev => [...prev, userMessage]);
		setIsLoading(true);
		setError(null);

		try {
			const response = await sendChatMessage(content, weatherContext, messages);
			
			const assistantMessage: ChatMessage = {
				role: 'assistant',
				content: response.message,
				timestamp: Date.now(),
			};

			setMessages(prev => [...prev, assistantMessage]);
			
			return response.suggestions;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to send message');
			return undefined;
		} finally {
			setIsLoading(false);
		}
	}, [weatherContext, messages]);

	const clearChat = useCallback(() => {
		setMessages([]);
		setError(null);
	}, []);

	return {
		messages,
		isLoading,
		error,
		sendMessage,
		clearChat,
		weatherContext,
		isReady: Boolean(weatherContext),
	};
}

