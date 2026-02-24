/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                mint: '#E4F1EE',
                'soft-orange': '#FFB38E',
                'primary-green': '#2D5A27',
            }
        },
    },
    plugins: [],
}
