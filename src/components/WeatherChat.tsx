import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useWeatherChat } from '@/hooks/useWeatherChat';

const QUICK_PROMPTS = [
	'What should I wear?',
	'Good for outdoor activities?',
	'Will it rain?',
	'Air quality',
];

const WeatherChat: React.FC = () => {
	const [isExpanded, setIsExpanded] = useState(true);
	const [input, setInput] = useState('');
	const [suggestions, setSuggestions] = useState<string[]>(QUICK_PROMPTS);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const { messages, isLoading, error, sendMessage, clearChat, isReady } = useWeatherChat();

	// Scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSend = async () => {
		if (!input.trim() || isLoading) return;
		
		const message = input.trim();
		setInput('');
		
		const newSuggestions = await sendMessage(message);
		if (newSuggestions) {
			setSuggestions(newSuggestions);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleSuggestionClick = async (suggestion: string) => {
		setInput('');
		const newSuggestions = await sendMessage(suggestion);
		if (newSuggestions) {
			setSuggestions(newSuggestions);
		}
	};

	return (
		<div className="w-full rounded-xl overflow-hidden border border-white/10 bg-white/5">
			{/* Header - always visible */}
			<div
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:from-blue-600/20 hover:to-purple-600/20 transition-colors cursor-pointer"
			>
				<div className="flex items-center gap-3">
					<div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
						<Sparkles className="w-4 h-4 text-white" />
					</div>
					<div className="text-left">
						<div className="font-medium text-white text-sm">Weather Assistant</div>
						<div className="text-[11px] text-slate-400">Ask what to wear, activities & more</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{messages.length > 0 && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								clearChat();
							}}
							className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
							title="Clear chat"
						>
							<Trash2 className="w-4 h-4" />
						</button>
					)}
					{isExpanded ? (
						<ChevronUp className="w-5 h-5 text-slate-400" />
					) : (
						<ChevronDown className="w-5 h-5 text-slate-400" />
					)}
				</div>
			</div>

			{/* Expandable content */}
			{isExpanded && (
				<div className="border-t border-white/10">
					{/* Messages area */}
					<div className="h-[200px] overflow-y-auto p-3 space-y-3">
						{messages.length === 0 ? (
							<div className="h-full flex flex-col items-center justify-center">
								<div className="text-slate-400 text-sm mb-3">
									Ask me anything about today's weather!
								</div>
								<div className="flex flex-wrap gap-2 justify-center">
									{suggestions.map((suggestion, i) => (
										<button
											key={i}
											onClick={() => handleSuggestionClick(suggestion)}
											disabled={!isReady || isLoading}
											className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-slate-300 rounded-full border border-white/10 transition-colors disabled:opacity-50"
										>
											{suggestion}
										</button>
									))}
								</div>
							</div>
						) : (
							<>
								{messages.map((msg, i) => (
									<div
										key={i}
										className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
									>
										<div
											className={`max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
												msg.role === 'user'
													? 'bg-blue-600 text-white rounded-br-sm'
													: 'bg-white/10 text-slate-200 rounded-bl-sm'
											}`}
										>
											{msg.content}
										</div>
									</div>
								))}
								
								{isLoading && (
									<div className="flex justify-start">
										<div className="bg-white/10 px-3 py-2 rounded-xl rounded-bl-sm">
											<div className="flex gap-1">
												<div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
												<div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
												<div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
											</div>
										</div>
									</div>
								)}

								{/* Suggestions after response */}
								{!isLoading && messages.length > 0 && suggestions.length > 0 && (
									<div className="flex flex-wrap gap-2 pt-1">
										{suggestions.map((suggestion, i) => (
											<button
												key={i}
												onClick={() => handleSuggestionClick(suggestion)}
												disabled={!isReady || isLoading}
												className="px-2.5 py-1 text-[11px] bg-white/5 hover:bg-white/10 text-slate-400 rounded-full border border-white/10 transition-colors disabled:opacity-50"
											>
												{suggestion}
											</button>
										))}
									</div>
								)}

								<div ref={messagesEndRef} />
							</>
						)}
					</div>

					{/* Error message */}
					{error && (
						<div className="px-3 py-2 bg-red-500/20 border-t border-red-500/30 text-red-300 text-xs">
							{error}
						</div>
					)}

					{/* Input */}
					<div className="p-3 border-t border-white/10 bg-black/20">
						<div className="flex items-center gap-2">
							<input
								ref={inputRef}
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder={isReady ? "Ask about the weather..." : "Loading..."}
								disabled={!isReady || isLoading}
								className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
							/>
							<button
								onClick={handleSend}
								disabled={!input.trim() || !isReady || isLoading}
								className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
							>
								<Send className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default WeatherChat;
