import { Config } from "tailwindcss/types/config";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "ucarecdn.com",
          port: "",
        
        },
      ],
    },
    webpack(config: Config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      });
      return config;
    },
  };
  
  export default nextConfig;