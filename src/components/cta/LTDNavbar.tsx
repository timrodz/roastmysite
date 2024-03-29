import metadata from "@/lib/metadata";
import { Badge, Box, Text, createStyles } from "@mantine/core";
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
          href={metadata.lifetimeDeal.checkoutLink}
          className="hover:no-underline"
        >
          <Box
            className={`${classes.root} z-10 flex relative isolate items-center gap-x-6 bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1`}
          >
            <Text fw={600} color="white">
              One-time deal: Become a lifelong roaster for{" "}
              {metadata.lifetimeDeal.priceLabel} USD using code{" "}
              <Badge component="span" color="gray" className="align-middle">
                EARLYBIRD
              </Badge>
            </Text>
            <button
              type="button"
              className="-m-3 p-3 focus-visible:outline-offset-[-4px] z-10 flex flex-1 justify-end"
              onClick={(e) => {
                e.preventDefault();
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
