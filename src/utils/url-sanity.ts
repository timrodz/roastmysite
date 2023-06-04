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
      error: "Please write a valid site (like https://twitter.com)",
    };
  }

  if (!ext) {
    return {
      sanitizedUrl: "",
      error: "Please write a valid site (like https://twitter.com)",
    };
  }

  const sanitizedUrl = base.replace("www.", "");
  console.log({ cleanedUpSite: sanitizedUrl });

  return {
    sanitizedUrl,
  };
}
