import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/models/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "Poppins", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: {
          DEFAULT: "var(--foreground)",
          secondary: "var(--foreground-secondary)",
          muted: "var(--foreground-muted)",
          disabled: "var(--foreground-disabled)",
        },
        // Deep dark palette
        void: {
          DEFAULT: "#0a0a0a",
          50: "#141414",
          100: "#1a1a1a",
          200: "#222222",
          300: "#2a2a2a",
          400: "#333333",
        },
        // Mysterious purple accent
        arcane: {
          50: "#f5f0ff",
          100: "#ede0ff",
          200: "#d8c0ff",
          300: "#b890ff",
          400: "#9455ff",
          500: "#7c1fff",
          DEFAULT: "#7c1fff",
          600: "#6a00e6",
          700: "#5700be",
          800: "#470099",
          900: "#3a007a",
          950: "#250050",
        },
        // Elegant gold accent
        luminary: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          DEFAULT: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        // Trusted blue
        sovereign: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          DEFAULT: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        // Surface layers
        surface: {
          DEFAULT: "#111111",
          raised: "#161616",
          overlay: "#1c1c1c",
          sunken: "#0d0d0d",
        },
        // Text layers
        ink: {
          primary: "#f0f0f0",
          secondary: "#a0a0a0",
          muted: "#666666",
          disabled: "#444444",
        },
        // Borders
        border: {
          DEFAULT: "rgba(255,255,255,0.06)",
          subtle: "rgba(255,255,255,0.04)",
          strong: "rgba(255,255,255,0.12)",
          accent: "rgba(124,31,255,0.3)",
          gold: "rgba(245,158,11,0.3)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "arcane-glow": "radial-gradient(ellipse at 50% 0%, rgba(124,31,255,0.15) 0%, transparent 60%)",
        "luminary-glow": "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.1) 0%, transparent 60%)",
        "hero-mesh": "radial-gradient(at 20% 20%, rgba(124,31,255,0.08) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(245,158,11,0.06) 0px, transparent 50%)",
        "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)",
        "surface-gradient": "linear-gradient(180deg, #161616 0%, #111111 100%)",
      },
      boxShadow: {
        "arcane-sm": "0 0 12px rgba(124,31,255,0.2)",
        "arcane-md": "0 0 24px rgba(124,31,255,0.25), 0 0 48px rgba(124,31,255,0.1)",
        "arcane-lg": "0 0 40px rgba(124,31,255,0.3), 0 0 80px rgba(124,31,255,0.15)",
        "luminary-sm": "0 0 12px rgba(245,158,11,0.2)",
        "luminary-md": "0 0 24px rgba(245,158,11,0.25), 0 0 48px rgba(245,158,11,0.1)",
        "card": "0 1px 1px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.2)",
        "card-hover": "0 2px 2px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.4), 0 16px 32px rgba(0,0,0,0.3)",
        "inset-top": "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "fade-up": "fadeUp 0.6s ease forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "drift": "drift 60s linear infinite",
        "hero-fade-up": "heroFadeUp 0.8s ease forwards",
        "hero-scale-in": "heroScaleIn 0.8s ease forwards",
        "hero-badge-pop": "heroBadgePop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "nav-link-fade-in": "navLinkFadeIn 0.4s ease forwards",
        "mobile-menu-open": "mobileMenuOpen 0.3s ease-out forwards",
        "mobile-menu-close": "mobileMenuClose 0.25s ease-in forwards",
        twinkle: "twinkle 4s ease-in-out infinite",
        "border-glow": "borderGlow 6s linear infinite",
        },
        keyframes: {
        borderGlow: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        fadeIn: {

          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0", transform: "translateX(-100%)" },
          "100%": { backgroundPosition: "200% 0", transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        drift: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(100vw)" },
        },
        heroFadeUp: {
          from: { opacity: "0", transform: "translateY(28px)", filter: "blur(4px)" },
          to: { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        heroScaleIn: {
          from: { opacity: "0", transform: "scale(0.92) translateY(20px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        heroBadgePop: {
          from: { opacity: "0", transform: "scale(0.85) translateY(8px)" },
          "60%": { opacity: "1", transform: "scale(1.04) translateY(-2px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        navLinkFadeIn: {
          from: { opacity: "0", transform: "translateX(-8px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        mobileMenuOpen: {
          from: { opacity: "0", transform: "scaleY(0.95)" },
          to: { opacity: "1", transform: "scaleY(1)" },
        },
        mobileMenuClose: {
          from: { opacity: "1", transform: "scaleY(1)" },
          to: { opacity: "0", transform: "scaleY(0.95)" },
        },
        twinkle: {
          "0%, 100%": { transform: "translateY(0) scale(1)", opacity: "0.3" },
          "50%": { transform: "translateY(-5px) scale(1.05)", opacity: "0.5" },
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;
