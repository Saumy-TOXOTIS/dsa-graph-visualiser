// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Make sure dark mode is enabled
    theme: {
        extend: {
            fontFamily: {
                // Set 'Inter' as the primary sans-serif font
                sans: ['Inter', ...fontFamily.sans],
            },
            colors: {
                // Define our new "Deep Space" color palette
                'space-dark': '#0D1117',   // Main background
                'space-panel': '#161B22',   // Sidebar panel background
                'space-border': '#30363D', // Borders for panels and inputs

                'accent-cyan': {
                    DEFAULT: '#22D3EE',
                    light: '#A5F3FC',
                },
                'accent-blue': {
                    DEFAULT: '#3B82F6',
                    light: '#60A5FA',
                },
                'accent-indigo': {
                    DEFAULT: '#6366F1',
                    light: '#818CF8'
                },
                'accent-violet': {
                    DEFAULT: '#8B5CF6',
                    light: '#C4B5FD'
                },
                'accent-fuchsia': {
                    DEFAULT: '#D946EF',
                    light: '#F0ABFC'
                },
                'accent-pink': {
                    DEFAULT: '#EC4899',
                    light: '#F472B6'
                },
                'accent-rose': {
                    DEFAULT: '#F43F5E',
                    light: '#FDA4AF'
                },
                'accent-orange': {
                    DEFAULT: '#F97316',
                    light: '#FB923C'
                },
                'accent-amber': {
                    DEFAULT: '#F59E0B',
                    light: '#FBBF24'
                },
                'accent-emerald': {
                    DEFAULT: '#10B981',
                    light: '#34D399'
                },
                // Text colors
                'text-primary': '#E6EDF3', // Main text in dark mode
                'text-secondary': '#8D96A0', // Subtler text
            }
        },
    },
    plugins: [],
}