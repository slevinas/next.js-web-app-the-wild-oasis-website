/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wzpaewklwhqbdrhtrvik.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "**",
      },
    ],
    domains: ["wzpaewklwhqbdrhtrvik.supabase.co", "lh3.googleusercontent.com"],
  },
};

export default nextConfig;
