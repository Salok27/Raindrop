import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	// For GitHub Pages - change 'weatherApp' to your repo name
	base: process.env.GITHUB_PAGES === 'true' ? '/RainDrop/' : '/',
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	build: {
		outDir: 'dist',
		sourcemap: false,
	},
	// Proxy for n8n webhook to bypass CORS in development
	server: {
		proxy: {
			'/api/n8n': {
				target: 'https://cov3rs.app.n8n.cloud',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/n8n/, ''),
				secure: true,
			}
		}
	}
});
