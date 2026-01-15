import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors - Mountain Goats: CDMX
        forest: {
          50: "#f0fdf5",
          100: "#dcfce8",
          200: "#bbf7d1",
          300: "#86efad",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803c",
          800: "#166533",
          900: "#14532d",
          950: "#022c22", // Primary deep forest green
        },
        navy: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554", // Primary deep navy blue
        },
        // Semantic colors
        background: {
          DEFAULT: "#f8fafc",
          dark: "#0a0a0a",
          muted: "#f1f5f9",
        },
        foreground: {
          DEFAULT: "#0f172a",
          muted: "#64748b",
          inverted: "#f8fafc",
        },
        // Accent colors for stats and badges
        altitude: "#7c3aed", // Purple for elevation/altitude
        distance: "#0891b2", // Cyan for distance
        duration: "#ea580c", // Orange for time
        difficulty: {
          easy: "#22c55e",
          moderate: "#eab308",
          hard: "#f97316",
          extreme: "#dc2626",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-oswald)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      fontSize: {
        // Display sizes for bold headers
        "display-2xl": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-xl": ["3.75rem", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "display-sm": ["1.875rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
      },
      backgroundImage: {
        // Gradient presets for hero sections
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-hero": "linear-gradient(135deg, #022c22 0%, #172554 50%, #0f172a 100%)",
        "gradient-hero-overlay": "linear-gradient(180deg, transparent 0%, rgba(2, 44, 34, 0.9) 100%)",
        "gradient-card": "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%)",
        "gradient-forest": "linear-gradient(135deg, #022c22 0%, #14532d 100%)",
        "gradient-navy": "linear-gradient(135deg, #172554 0%, #1e3a8a 100%)",
      },
      boxShadow: {
        "elevation-low": "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
        "elevation-medium": "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
        "elevation-high": "0 20px 25px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.04)",
        "glow-forest": "0 0 40px rgba(2, 44, 34, 0.3)",
        "glow-navy": "0 0 40px rgba(23, 37, 84, 0.3)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
    },
  },
  plugins: [],
};

export default config;

