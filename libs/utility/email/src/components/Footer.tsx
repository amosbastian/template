import { MjmlSection, MjmlWrapper } from "@faire/mjml-react";
import { colors } from "../theme";

type FooterProps = {
  includeUnsubscribe?: boolean;
};

export function Footer({ includeUnsubscribe = false }: FooterProps) {
  return (
    <MjmlWrapper backgroundColor={colors.gray800}>
      <MjmlSection></MjmlSection>
    </MjmlWrapper>
  );
}
