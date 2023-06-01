/**
 * This file is needed in order for SSR to work with Mantine + Next
 * https://mantine.dev/theming/emotion-cache/
 */
import { createEmotionCache } from "@mantine/core";

export const cache = createEmotionCache({ key: "resume" });
