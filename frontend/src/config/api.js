

const getBackendUrl = () => {
  // 1️⃣ Environment variable (required for prod)
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_API_BASE_URL
  ) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // 2️⃣ Development fallback
  const hostname = window.location.hostname;
  const isLocalhost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0";

  if (isLocalhost) {
    return "http://localhost:5000"; 
  }

  // 3️⃣ Safety fallback (no prod URL leaked)
  throw new Error(
    "VITE_API_BASE_URL is not defined. Please set it in the environment variables."
  );
};

export const API_BASE_URL = getBackendUrl();
