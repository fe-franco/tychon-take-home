import type { ExpoConfig } from "@expo/config";

const SUPABASE_URL = "https://oirrbmncgkurmuiadqqu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcnJibW5jZ2t1cm11aWFkcXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ2MDgyNTksImV4cCI6MjAwMDE4NDI1OX0.vvfMWyd5Qa1kMr5Bnp4NC6ZO7eF1LKoJNunAiNC5ZHk";
if (typeof SUPABASE_URL !== "string" || typeof SUPABASE_ANON_KEY !== "string") {
  throw new Error("Missing Supabase URL or anonymous key");
}

const defineConfig = (): ExpoConfig => ({
  name: "expo",
  slug: "expo",
  scheme: "expo",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#1F104A",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "your.bundle.identifier",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#1F104A",
    },
  },
  extra: {
    eas: {
      // projectId: "your-project-id",
    },
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
  },
  plugins: [
    "./expo-plugins/with-modify-gradle.js",
    "expo-apple-authentication",
  ],
});

export default defineConfig;
