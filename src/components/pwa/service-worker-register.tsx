"use client";

import { useEffect } from "react";

const SW_PATH = "/sw.js";
const SW_SCOPE = "/";

const isLocalhost = (hostname: string) =>
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname.startsWith("127.0.0.") ||
  hostname.endsWith(".local");

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return;
    }

    if (!("serviceWorker" in navigator)) {
      if (process.env.NODE_ENV !== "production") {
        console.info("[PWA] Service workers are not supported in this browser.");
      }
      return;
    }

    const secureContext = window.isSecureContext || isLocalhost(window.location.hostname);
    if (!secureContext) {
      console.warn("[PWA] Service worker registration skipped: insecure context.");
      return;
    }

    let isMounted = true;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register(SW_PATH, {
          scope: SW_SCOPE,
        });

        if (!isMounted) {
          registration.unregister();
          return;
        }

        if (process.env.NODE_ENV !== "production") {
          console.info("[PWA] Service worker registered", registration.scope);
        }
      } catch (error) {
        console.error("[PWA] Service worker registration failed", error);
      }
    };

    register();

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}
