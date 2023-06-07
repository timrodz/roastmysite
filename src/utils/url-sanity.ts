import path from "path";

/** Grabs an image with the format ![alt](url) to <img src="url" alt="alt" /> */
export const parseAllMarkdownImages = (text: string) => {
  const pattern = /!\[([^\]]*)\]\(([^)]*)\)/g;
  const replacedText = text.replace(
    pattern,
    '<img class="roast-img" alt=$1 src="$2" />'
  );
  return replacedText;
};

export function extractMarkdownImage(
  markdownImage: string
): { alt: string; url: string } | undefined {
  const pattern = /!\[([^\]]*)\]\(([^)]*)\)/;

  console.log({ markdownImage });
  const match = markdownImage.match(pattern);
  if (!match) {
    return undefined;
  }

  const [_, alt, url] = match;
  console.log({ alt, url });
  return { alt, url };
}

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

  const sanitizedUrl = base
    .replace("www.", "")
    .replaceAll(" ", "")
    .replace(/[^a-z0-9.]/, "");

  return {
    sanitizedUrl,
  };
}
