import path from "path";

export function sanitizeRoastUrl(url: string): {
  sanitizedUrl: string;
  error?: string;
} {
  const { ext, base } = path.parse(url);

  // Check if site is valid
  if (!base) {
    return {
      sanitizedUrl: "",
      error: "Please type a valid website (twitter.com ✅ twitter ❌)",
    };
  }

  if (!ext) {
    return {
      sanitizedUrl: "",
      error: "Please type a valid website (twitter.com ✅ twitter ❌)",
    };
  }

  const sanitizedUrl = base.replace("www.", "");

  return {
    sanitizedUrl,
  };
}
