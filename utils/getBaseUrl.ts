export function getBaseUrl() {
    if (typeof window !== "undefined") {
      // We are in the browser
      return window.location.origin
    }
    if (process.env.NEXT_PUBLIC_APP_URL) {
      // We are on the server and have access to the environment variable
      return process.env.NEXT_PUBLIC_APP_URL
    }
    // Fallback, though this should never happen
    return "http://localhost:3000"
  }
  
  