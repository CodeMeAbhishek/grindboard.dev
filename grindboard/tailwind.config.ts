import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAFA",
        surface: "#FFFFFF",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F3F4F6",
        "surface-container": "#F9FAFB",
        "surface-container-high": "#F3F4F6",
        "surface-container-highest": "#E5E7EB",
        "on-background": "#1A1A1A",
        "on-surface": "#1A1A1A",
        "on-surface-variant": "#6B7280",
        primary: "#10B981",
        "primary-container": "#D1FAE5",
        "primary-hover": "#059669",
        "on-primary": "#FFFFFF",
        "on-primary-container": "#047857",
        secondary: "#0EA5E9",
        "secondary-container": "#E0F2FE",
        "on-secondary": "#FFFFFF",
        "on-secondary-container": "#0369A1",
        tertiary: "#F59E0B",
        "tertiary-container": "#FEF3C7",
        "on-tertiary": "#FFFFFF",
        "on-tertiary-container": "#92400E",
        error: "#EF4444",
        "error-container": "#FEE2E2",
        "on-error": "#FFFFFF",
        "on-error-container": "#991B1B",
        outline: "#E5E5E5",
        "outline-variant": "#E5E5E5",
      },
      fontFamily: {
        "body-md": ["Inter", "sans-serif"],
        "label-mono": ["JetBrains Mono", "monospace"],
        "display-xl": ["Geist", "sans-serif"],
        "headline-lg": ["Geist", "sans-serif"],
        "headline-lg-mobile": ["Geist", "sans-serif"],
        "stat-lg": ["Geist", "sans-serif"],
      },
      fontSize: {
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-mono": [
          "14px",
          { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "500" },
        ],
        "display-xl": [
          "48px",
          {
            lineHeight: "56px",
            letterSpacing: "-0.04em",
            fontWeight: "800",
          },
        ],
        "headline-lg": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "headline-lg-mobile": [
          "24px",
          { lineHeight: "32px", fontWeight: "700" },
        ],
        "stat-lg": ["24px", { lineHeight: "24px", fontWeight: "700" }],
      },
      spacing: {
        xs: "8px",
        sm: "16px",
        md: "24px",
        lg: "40px",
        xl: "64px",
        base: "4px",
        gutter: "20px",
        "margin-mobile": "16px",
        "margin-desktop": "48px",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        sm: "0.125rem",
        md: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
        panel: "0 1px 3px rgba(0,0,0,0.05)",
        modal:
          "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "slide-up": "slideUp 0.3s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(5px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
