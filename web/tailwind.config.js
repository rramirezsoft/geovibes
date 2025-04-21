/**@type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
      ],
      theme: {
        extend: {
          colors: {
            background: "var(--background)",
            foreground: "var(--foreground)",
          },
          fontFamily: {
            baloo: "var(--font-baloo)",
            inter: "var(--font-inter)",
          },
        },
      },
      plugins: [],
    };
