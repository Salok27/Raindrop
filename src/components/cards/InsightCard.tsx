import React from 'react';

const enabled = import.meta.env.VITE_ENABLE_N8N_INSIGHTS === 'true' && !!import.meta.env.VITE_N8N_INSIGHTS_URL;

interface InsightCardProps {}

const InsightCard: React.FC<InsightCardProps> = () => {
	if (!enabled) return null;
	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10">
			<div className="text-sm text-slate-300">Insights</div>
			<div className="mt-2 text-slate-400">Connected. Waiting for data…</div>
		</div>
	);
};

export default InsightCard;
