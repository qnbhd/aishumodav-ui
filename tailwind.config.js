/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        fontSize: {
            sm: '0.6rem',
            base: '0.8rem',
            md: '1rem',
            xl: '1.25rem',
            '2xl': '1.563rem',
            '3xl': '1.953rem',
            '4xl': '2.441rem',
            '5xl': '3.052rem',
        },
        extend: {},
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: [
            {
                light: {
                    ...require('daisyui/src/theming/themes')['[data-theme=light]'],
                    // "primary": "blue",
                    // "primary-focus": "mediumblue",
                    'anti-base': 'black',
                },
            },
            {
                dark: {
                    ...require('daisyui/src/theming/themes')['[data-theme=dark]'],
                    'base-100': '#101827',
                    'base-200': '#1F2937',
                    'base-300': '#374151',
                    'anti-base': 'white',
                    // "primary": "blue",
                    // "primary-focus": "mediumblue",
                },
            },
        ],
    },
};
