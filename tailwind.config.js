import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      screens: {
        'pm': '428px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        orange: "var(--light-orange)",
        lightOrange: "var(--light-orange)",
        lighterOrange: "var(--lighter-orange)",
        darkOrange: "var(--dark-orange)",
        blue: "var(--blue)",
        grey: "var(--grey)",
        white: "var(--white)",
        black: "var(--black)",
        grey10: "var(--grey-10)",
        grey20: "var(--grey-20)",
        grey40: "var(--grey-40)",
        grey60: "var(--grey-60)",
        grey80: "var(--grey-80)",
        greyHighlight: "var(--grey-highlight)",
        lightBlue: "var(--light-blue)",
        darkContrast: "var(--dark-contrast)",
        mediumDarkContrast: "var(--medium-dark-contrast)",
        lightDarkContrast: "var(--light-dark-contrast)",
        coreDarkContrast: "var(--core-dark-contrast)",

        green: "#4FE3C1",
        red: "#FF627E",

        'contrast1.5': '#1F2327',

        contrast1: "hsla(216, 10%, 10%, 1)",
        contrast2: "hsla(210, 7%, 17%, 1)",
        contrast3: "hsla(225, 7%, 23%, 1)",
        contrast4: "hsla(200, 6%, 29%, 1)",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
    gridTemplateColumns: {
      "2": "repeat(2, minmax(0, 1fr))",
      "12": "repeat(12, minmax(0, 1fr))",
      "24": "repeat(24, minmax(0, 1fr))",
    },
  },
  plugins: [],
  safelist: ["lg:col-span-6", "lg:col-span-3", "xl:col-span-3"],
} satisfies Config;
