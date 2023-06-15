import { sanitizeRoastUrl } from "@utils/url-sanity";
import { useGlobalStyles } from "@utils/use-global-styles";
import {
  Box,
  Button,
  Flex,
  Text,
  TextInput,
  createStyles,
} from "@mantine/core";
import { IconFlame } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  typeYourSiteInput: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: 0,
  },

  typeYourSiteInputWrapper: {
    width: "100%",
    flex: "1",
  },

  typeYourSiteButton: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
}));

export default function StartRoastingCTA() {
  const router = useRouter();
  const { classes } = useStyles();
  const { classes: globalClasses } = useGlobalStyles();
  const [siteToRoast, siteToRoastSet] = useState("");
  const [formError, formErrorSet] = useState("");

  const onClickCTA = (e: any) => {
    e.preventDefault();

    const { sanitizedUrl, error } = sanitizeRoastUrl(siteToRoast);

    if (error) {
      formErrorSet(error);
      return;
    }

    router.push(`/view/${sanitizedUrl}`);
  };

  return (
    <>
      <Box mb={60} maw={500} mx="auto">
        <Flex align="center">
          <TextInput
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onClickCTA(e);
              }
            }}
            type="url"
            placeholder="roastmysite.io"
            size="lg"
            icon={<IconFlame size="1.5rem" stroke={1.5} />}
            classNames={{
              input: classes.typeYourSiteInput,
              root: classes.typeYourSiteInputWrapper,
            }}
            error={formError.length > 0}
            value={siteToRoast}
            onChange={(e) => {
              // Reset form error if there was one
              if (formError) {
                formErrorSet("");
              }
              siteToRoastSet(e.target.value);
            }}
          />
          <Button
            size="lg"
            className={classes.typeYourSiteButton}
            onClick={onClickCTA}
          >
            Go
          </Button>
        </Flex>
        {formError && (
          <Text
            color="red"
            mt={10}
            size="sm"
            className={globalClasses.textAlign}
          >
            {formError}
          </Text>
        )}
      </Box>
    </>
  );
}
