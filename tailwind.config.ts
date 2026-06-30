import type { Config } from "tailwindcss";

const config: Config = {
//   content: [
//     "./app/**/*.{ts,tsx,js,jsx}",
//     "./pages/**/*.{ts,tsx,js,jsx}",
//     "./components/**/*.{ts,tsx,js,jsx}",
//   ],
  theme: {
    extend: {
      screens: {
        sgplus: "1180px", // custom breakpoint
      },
    },
  },
  plugins: [],
};

export default config;