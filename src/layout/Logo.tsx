import { Group, Text, TitleOrder } from "@mantine/core";
import { IconFlame } from "@tabler/icons-react";
import Link from "next/link";

interface Props {
  size?: "lg" | "sm";
}

export default function Logo({ size = "lg" }: Props) {
  return (
    <Text fz={{ base: 18, sm: 22 }} fw={600}>
      <Link href="/">
        <Group noWrap spacing={2}>
          <IconFlame size={size === "lg" ? "1.5rem" : "1.25rem"} />
          Roast My Site
        </Group>
      </Link>
    </Text>
  );
}
