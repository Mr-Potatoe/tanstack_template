import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TanStack PWA Template",
    short_name: "TanStack PWA",
    description:
      "A reusable Next.js + TanStack starter preconfigured with install-ready PWA defaults.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "fullscreen", "minimal-ui"],
    orientation: "portrait",
    background_color: "#020617",
    theme_color: "#0EA5E9",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/maskable-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/icons/icon-512.png",
        type: "image/png",
        sizes: "512x512",
        label: "TanStack Template",
      },
    ],
    shortcuts: [
      {
        name: "Dashboard",
        short_name: "Dashboard",
        url: "/",
        description: "Navigate to the default dashboard view.",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    ],
    related_applications: [],
    categories: ["productivity", "development", "utilities"],
    lang: "en",
    dir: "ltr",
    prefer_related_applications: false,
  };
}
