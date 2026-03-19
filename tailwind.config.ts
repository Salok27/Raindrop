import type { Config } from 'tailwindcss';

export default {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['ui-sans-serif', 'system-ui', 'Apple Color Emoji', 'Segoe UI Emoji']
			}
		}
	},
	plugins: []
} satisfies Config;
