import { Box, Text, createStyles } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

export const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.orange[9],
  },
}));

export default function LTDNavbar() {
  const { classes } = useStyles();
  const [hidden, hiddenSet] = useState(false);

  return (
    <>
      <Box hidden={hidden}>
        <Link
          target="_blank"
          href="https://roastmysite.lemonsqueezy.com/checkout/buy/0c26096a-1be4-41ac-a05f-0dbb8addd747?discount=0"
          className="hover:no-underline"
        >
          <Box
            className={`${classes.root} z-10 flex relative isolate items-center gap-x-6 bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1`}
          >
            <Text fw={600} color="white">
              Lifetime Deal - Become a veteran roaster for $17 USD
            </Text>
            <button
              type="button"
              className="-m-3 p-3 focus-visible:outline-offset-[-4px] z-10 flex flex-1 justify-end"
              onClick={(e) => {
                e.preventDefault();
                console.log("close");
                hiddenSet(true);
              }}
            >
              <span className="sr-only">Dismiss</span>
              <IconX color="white" />
            </button>
          </Box>
        </Link>
      </Box>
    </>
  );
}
