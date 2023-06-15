import { IconNumber1, IconNumber2, IconNumber3 } from "@tabler/icons-react";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  lifetimeDeal: {
    priceLabel: "$17",
    checkoutLink:
      "https://roastmysite.lemonsqueezy.com/checkout/buy/b6d8fa9c-d295-4759-860c-cced3d7117f1?checkout%5Bdiscount_code%5D=EARLYBIRD",
  },
  features: [
    {
      title: "Visit the website you want to roast",
      icon: IconNumber1,
      description:
        "This will help you prepare your roast. Try act as a field expert, but also a newbie. Everyone is a potential customer.",
    },
    {
      title: "Room for improvement",
      icon: IconNumber2,
      description:
        "Have you noticed what works well and what doesn't? Chances are, the founder needs to know this!",
    },
    {
      title: "Roast the website!",
      icon: IconNumber3,
      description:
        "Share the love by letting the founder publicly know how they can improve their website and land those customers.",
    },
  ],
  faq: [
    {
      q: "How does Roast My Site work?",
      a: "",
    },
    { q: "What does the lifetime license give me?", a: "" },
    { q: "What does the lifetime license give me?", a: "" },
  ],
};

export const CONSTANTS = {
  MAX_ROASTS_FREE_USER: 2,
};
