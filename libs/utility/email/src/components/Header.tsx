import { MjmlColumn, MjmlSection, MjmlWrapper } from "@faire/mjml-react";
import { BASE_URL } from "@template/configuration";
import { colors, fontSize, fontWeight } from "../theme";
import { Link } from "./link";
import { Text } from "./text";

export function Header() {
  return (
    <MjmlWrapper padding="0 0 40px">
      <MjmlSection cssClass="gutter">
        <MjmlColumn>
          <Text align="center">
            <Link
              color={colors.white}
              fontSize={fontSize.xl}
              fontWeight={fontWeight.bold}
              href={BASE_URL}
              textDecoration="none"
            >
              <img height={40} width={40} src={`${BASE_URL}/images/favicon-196.png`} alt="" />
            </Link>
          </Text>
        </MjmlColumn>
      </MjmlSection>
    </MjmlWrapper>
  );
}
