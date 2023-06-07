import SEO from "@/components/misc/SEO";
import { useGlobalStyles } from "@/utils/use-global-styles";
import { Button, Container, Flex, Text, Title } from "@mantine/core";

export default function ThankYou() {
  const { classes } = useGlobalStyles();
  return (
    <>
      <SEO
        title="Thank You"
        description="Thank You for purchasing a lifetime license for Roast My Site"
      />
      <main>
        <Container size="sm" className={classes.pageWrapper}>
          <Title
            fz={{ base: 30, sm: 46 }}
            mb="xl"
            className={classes.textAlign}
          >
            Thank you for purchasing a{" "}
            <Text component="span" color="orange">
              lifetime license
            </Text>{" "}
            to Roast My Site!
          </Title>
          <Title
            order={2}
            fz={{ base: 30, sm: 40 }}
            mb={40}
            className={classes.textAlign}
          >
            🎉🎊🎉🎊🎉🎊🎉🎊🎉
          </Title>
          <Title
            order={3}
            fz={{ base: 20, sm: 26 }}
            mb="xs"
            className={classes.textAlign}
          >
            Your next steps:
          </Title>
          <Flex
            align={{ base: "stretch", xs: "center" }}
            justify={{ base: "start", xs: "center" }}
            direction="column"
            gap={10}
            mb="xl"
          >
            <Button size="xl" component="a" href="/login" variant="outline">
              Create an account if you haven&apos;t yet
            </Button>
            <Button size="xl" component="a" href="/login">
              Check out the top roasts and start roasting
            </Button>
          </Flex>
          <Text fz={{ base: 16, sm: 20 }} mb="xl" className={classes.textAlign}>
            P.S: I haven&apos;t automated the license activation yet, so
            I&apos;ll have to do it manually. Please make sure your account
            email was the same account used for purchasing the license.
          </Text>
        </Container>
      </main>
    </>
  );
}
