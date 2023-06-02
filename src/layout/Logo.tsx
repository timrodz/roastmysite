import { Group, Image, Title, TitleOrder, rem } from "@mantine/core";
import { IconFlame } from "@tabler/icons-react";
import Link from "next/link";

interface Props {
  size?: "lg" | "sm";
}

export default function Logo({ size = "lg" }: Props) {
  let titleOrder: TitleOrder = 2;
  switch (size) {
    case "sm":
      titleOrder = 5;
      break;
    default:
      titleOrder = 3;
      break;
  }
  return (
    <Title order={titleOrder}>
      <Link href="/">
        <Group noWrap spacing={2}>
          <IconFlame size={size === "lg" ? "2rem" : "1rem"} />
          Roast My Site
        </Group>
      </Link>
    </Title>
  );
}
