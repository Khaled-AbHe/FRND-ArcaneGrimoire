/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Grimoire dark palette
        ink: {
          950: '#0a0b0f',
          900: '#0f1117',
          800: '#161820',
          700: '#1e2130',
          600: '#252840',
        },
        // Amber/gold accent — spell energy
        amber: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // Muted slate for secondary text/borders
        slate: {
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
        },
        // Accent colours for schools / damage types
        evocation:  '#ef4444',
        necromancy: '#a855f7',
        conjuration:'#22c55e',
        illusion:   '#6366f1',
        divination: '#06b6d4',
        abjuration: '#3b82f6',
        enchantment:'#ec4899',
        transmutation: '#f97316',
      },
      fontFamily: {
        display: ['"Cinzel"', 'Georgia', 'serif'],
        body:    ['"Crimson Pro"', 'Georgia', 'serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow:       '0 0 20px rgba(251,191,36,0.15)',
        'glow-lg':  '0 0 40px rgba(251,191,36,0.25)',
        'inner-glow':'inset 0 1px 0 rgba(251,191,36,0.1)',
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
