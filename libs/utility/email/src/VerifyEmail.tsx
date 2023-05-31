import { MjmlColumn, MjmlDivider, MjmlSection, MjmlWrapper } from "@faire/mjml-react";
import { BRAND_NAME } from "@template/configuration";
import BaseLayout from "./components/BaseLayout";
import Button from "./components/Button";
import Header from "./components/Header";
import Heading from "./components/Heading";
import Link from "./components/Link";
import Text from "./components/Text";
import { colors, fontSize, fontWeight, screens, spacing } from "./theme";

const welcomeStyle = `
  .h1 > * {
    font-size: 56px !important;
  }
  .h2 > * {
    font-size: ${fontSize.lg}px !important;
  }
  .p > * {
    font-size: ${fontSize.base}px !important;
  }

  @media (min-width:${screens.xs}) {
    .h1 > * {
      font-size: 84px !important;
    }
    .h2 > * {
      font-size: ${fontSize.xxl}px !important;
    }
    .p > * {
      font-size: ${fontSize.md}px !important;
    }
  }
`;

type VerifyEmailProps = {
  name: string;
  verificationLink?: string;
};

export const VerifyEmail = ({ name, verificationLink }: VerifyEmailProps) => {
  return (
    <BaseLayout width={600} style={welcomeStyle}>
      <Header />
      <MjmlWrapper backgroundColor={colors.white}>
        <MjmlSection cssClass="gutter">
          <MjmlColumn>
            <Heading cssClass="h2" align="center" paddingBottom={spacing.s8}>
              Verify your email for <strong>{BRAND_NAME}</strong>
            </Heading>
            <Text cssClass="p" fontSize={fontSize.sm} paddingBottom={spacing.s7}>
              Hello, {name}
            </Text>
            <Text cssClass="p" fontSize={fontSize.sm} paddingBottom={spacing.s7}>
              To verify your email address on {BRAND_NAME}, please click the button below:
            </Text>

            <Button
              href="https://github.com/sofn-xyz/mailing-templates"
              backgroundColor={colors.black}
              color={colors.white}
              align="center"
            >
              Verify email
            </Button>
            <Text cssClass="p" fontSize={fontSize.sm} paddingTop={spacing.s7} paddingBottom={spacing.s7}>
              or copy and paste this URL into your browser:{" "}
              <Link href={verificationLink} textDecoration="none">
                {verificationLink}
              </Link>
            </Text>
            <MjmlDivider border-width="1px" border-color={colors.border} />
            <Text color={colors.gray500} cssClass="p" fontSize={fontSize.xs} paddingTop={spacing.s7}>
              This email was intended for <span style={{ fontWeight: fontWeight.medium }}>{name}</span>. If you were not
              expecting this invitation, you can ignore this email. If you are concerned about your account's safety,
              please reply to this email to get in touch with us.
            </Text>
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
    </BaseLayout>
  );
};

VerifyEmail.subject = "Verify your email";

export default VerifyEmail;
