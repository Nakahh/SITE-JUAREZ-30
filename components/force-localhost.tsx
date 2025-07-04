"use client";

import { useEffect } from "react";

export default function ForceLocalhost() {
  useEffect(() => {
    // Force redirect to localhost if accessing from any other domain
    if (typeof window !== "undefined") {
      const currentHost = window.location.hostname;
      const currentUrl = window.location.href;

      // Check if we're not on localhost
      if (currentHost !== "localhost" && currentHost !== "127.0.0.1") {
        console.log("🚨 Not on localhost, redirecting...");
        console.log("Current host:", currentHost);
        console.log("Current URL:", currentUrl);

        // Force redirect to localhost
        const localhostUrl =
          "http://localhost:3000" +
          window.location.pathname +
          window.location.search;
        window.location.replace(localhostUrl);
      }

      // Block any fly.dev requests
      const originalFetch = window.fetch;
      window.fetch = function (...args: any[]) {
        const url = String(args[0] || "");
        if (
          url.includes("fly.dev") ||
          url.includes("1f687d367311492e88ec0eb21dfc8b09")
        ) {
          console.log("🚨 BLOCKED FLY.DEV REQUEST, REDIRECTING TO LOCALHOST");
          window.location.replace("http://localhost:3000/");
          return Promise.reject(new Error("Fly.dev request blocked"));
        }
        return originalFetch.apply(this, args);
      };
    }
  }, []);

  return null; // This component doesn't render anything
}
