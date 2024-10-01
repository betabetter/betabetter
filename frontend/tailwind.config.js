/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
        fontFamily: {
            'display': ['Ubuntu'],
            'body': ['Ubuntu'],
            'sans': ['Ubuntu', 'system-ui', 'sans-serif']
        },
        colors: {
          'bb-blue': '#3C78D8'
        }
    },
    plugins: [],
}

