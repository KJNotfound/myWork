/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scada: {
          bg: '#020617',
          panel: '#0f172a',
          border: '#1e293b',
          cyan: '#06b6d4',
          blue: '#3b82f6',
          red: '#ef4444',
          orange: '#f97316',
          purple: '#8b5cf6',
          'light-bg': '#f8fafc',
          'light-panel': '#ffffff',
          'light-border': '#e2e8f0',
          'light-cyan': '#0891b2',
          'light-blue': '#2563eb',
          'light-red': '#dc2626',
          'light-orange': '#ea580c',
          'light-purple': '#7c3aed'
        }
      },
      animation: {
        'flow-fast': 'flow 1.2s linear infinite',
        'flow-normal': 'flow 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0, 1) infinite',
      },
      keyframes: {
        flow: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.9))' },
          '50%': { opacity: 0.6, filter: 'drop-shadow(0 0 3px rgba(239, 68, 68, 0.3))' },
        }
      }
    },
  },
  plugins: [],
}
