/** @type {import('next').NextConfig} */

function supabaseImagePatterns() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) {
    return [{ protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" }];
  }
  try {
    const hostname = new URL(url).hostname;
    return [
      { protocol: "https", hostname, pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" },
    ];
  } catch {
    return [{ protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" }];
  }
}

const nextConfig = {
  images: {
    remotePatterns: [
      ...supabaseImagePatterns(),
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "saldiviabuses.com.ar", pathname: "/wp-content/uploads/**" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "16mb",
    },
  },
};

export default nextConfig;
