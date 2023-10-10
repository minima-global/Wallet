/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.5s',
                fadeIn1: 'fadeIn 1s',
                fadeIn2: 'fadeIn 2s',
                fadeIn3: 'fadeIn 3s',
                fadeIn5: 'fadeIn 5s',
                fadeIn7: 'fadeIn 7s',
            },
        },
    },
    plugins: [],
};
