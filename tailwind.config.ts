import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{ts,tsx}"],
	prefix: "",
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'"Atkinson Hyperlegible Next"',
					'ui-sans-serif',
					'system-ui',
					'-apple-system',
					'"Segoe UI"',
					'Roboto',
					'Helvetica',
					'Arial',
					'sans-serif',
				],
				mono: [
					'ui-monospace',
					'SFMono-Regular',
					'Menlo',
					'Consolas',
					'"Liberation Mono"',
					'monospace',
				],
			},
			// Type scale: ratio 1.25 from 17 px.
			fontSize: {
				caption: ['0.875rem', { lineHeight: '1.5' }],
				body: ['1.0625rem', { lineHeight: '1.6' }],
				lede: ['1.3125rem', { lineHeight: '1.5' }],
				'h2-sm': ['1.625rem', { lineHeight: '1.2' }],
				h2: ['2.0625rem', { lineHeight: '1.15' }],
				'h1-sm': ['2.5625rem', { lineHeight: '1.15' }],
				h1: ['3.25rem', { lineHeight: '1.1' }],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Diagram and flowline colours: each one carries a meaning.
				flow: 'hsl(var(--flow))',
				store: 'hsl(var(--store))',
				model: 'hsl(var(--model))',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
		}
	},
	plugins: [],
} satisfies Config;
