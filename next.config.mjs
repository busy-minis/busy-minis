/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tzutqpkiuemiffqcgjtn.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/drivers/**",
      },
    ],
  },
};

export default nextConfig;
