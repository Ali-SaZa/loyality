/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https", // یا 'http' بسته به پروتکل استفاده شده
        hostname: "file-dev.ramooz.org", // نام دامنه
        pathname: "/**", // این الگو برای انتخاب تمامی مسیرها استفاده می‌شود
      },
    ],
  },
  turbopack: {
    rules: {
      "*.scss": {
        loaders: ["sass-loader"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
