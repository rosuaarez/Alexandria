import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Fija la raíz del workspace a web/ para que Turbopack no infiera mal el root
  // cuando existen otros lockfiles en directorios superiores del repo.
  turbopack: {
    root: path.join(__dirname),
  },

  // Headers de seguridad para producción.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // Logs más limpios en producción.
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
