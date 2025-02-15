/** @type {import('tailwindcss').Config} */

const flowbite = require("flowbite-react/tailwind");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
                "./node_modules/flowbite/**/*.js"


  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["business"],
  },
  plugins: [
    require('daisyui'),
    flowbite.plugin(),

  ],
}