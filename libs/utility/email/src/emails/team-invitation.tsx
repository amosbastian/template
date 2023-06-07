import { MjmlColumn, MjmlDivider, MjmlGroup, MjmlSection, MjmlWrapper } from "@faire/mjml-react";
import { BRAND_NAME } from "@template/configuration";
import { BaseLayout, Button, Header, Heading, Link, Text } from "../components";
import { colors, fontSize, fontWeight, screens, spacing } from "../theme";

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

type TeamInvitationProps = {
  inviteLink: string;
  invitedByEmail: string;
  invitedByName?: string | null;
  name?: string | null;
  teamImage?: string | null;
  teamName: string;
  userImage?: string | null;
  userEmail: string;
};

export const TeamInvitation = ({
  inviteLink,
  invitedByEmail,
  invitedByName,
  name,
  teamImage,
  teamName,
  userImage,
  userEmail,
}: TeamInvitationProps) => {
  return (
    <BaseLayout width={600} style={welcomeStyle}>
      <Header />
      <MjmlWrapper backgroundColor={colors.white}>
        <MjmlSection cssClass="gutter" paddingBottom={spacing.s7}>
          <MjmlColumn>
            <Heading cssClass="h2" align="center" paddingBottom={spacing.s8}>
              Join my team <strong>{teamName}</strong> on <strong>{BRAND_NAME}</strong>
            </Heading>
            <Text cssClass="p" fontSize={fontSize.sm} paddingBottom={spacing.s7}>
              Hello, {name}
            </Text>
            <Text cssClass="p" fontSize={fontSize.sm}>
              {invitedByName ? (
                <>
                  {invitedByName} (
                  <Link href={`mailto:${invitedByEmail}`} textDecoration="none">
                    {invitedByEmail}
                  </Link>
                  )
                </>
              ) : (
                <Link href={`mailto:${invitedByEmail}`} textDecoration="none">
                  {invitedByEmail}
                </Link>
              )}{" "}
              has invited you to the {teamName} team on {BRAND_NAME}.
            </Text>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection cssClass="gutter" paddingBottom={spacing.s7}>
          <MjmlGroup>
            <MjmlColumn width="40%">
              <Text align="right">
                <img
                  height={64}
                  width={64}
                  src={userImage ?? "https://avatar.vercel.sh/amosbastian.png"}
                  alt=""
                  style={{ borderRadius: "50%" }}
                />
              </Text>
            </MjmlColumn>
            <MjmlColumn width="20%">
              <Text align="center" paddingTop={16}>
                &rarr;
              </Text>
            </MjmlColumn>
            <MjmlColumn width="40%">
              <Text align="left">
                <img
                  height={64}
                  width={64}
                  src={teamImage ?? "https://avatar.vercel.sh/random.png"}
                  alt=""
                  style={{ borderRadius: "50%" }}
                />
              </Text>
            </MjmlColumn>
          </MjmlGroup>
        </MjmlSection>
        <MjmlSection cssClass="gutter">
          <MjmlColumn>
            <Button href={inviteLink} backgroundColor={colors.black} color={colors.white} align="center">
              Join the team
            </Button>
            <Text cssClass="p" fontSize={fontSize.sm} paddingTop={spacing.s7} paddingBottom={spacing.s7}>
              or copy and paste this URL into your browser:{" "}
              <Link href={inviteLink} textDecoration="none">
                {inviteLink}
              </Link>
            </Text>
            <MjmlDivider border-width="1px" border-color={colors.border} />
            <Text color={colors.gray500} cssClass="p" fontSize={fontSize.xs} paddingTop={spacing.s7}>
              {name ? (
                <>
                  This email was intended for <span style={{ fontWeight: fontWeight.medium }}>{name ?? userEmail}</span>
                  .
                </>
              ) : null}{" "}
              If you were not expecting this invitation, you can ignore this email. If you are concerned about your
              account's safety, please reply to this email to get in touch with us.
            </Text>
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
    </BaseLayout>
  );
};

TeamInvitation.subject = "Verify your email";

export default TeamInvitation;
