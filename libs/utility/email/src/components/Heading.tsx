import * as React from "react";
import { fontFamily, fontSize, fontWeight, lineHeight } from "../theme";
import { Text } from "./text";

type HeadingProps = React.ComponentProps<typeof Text>;

const defaultProps = {
  fontFamily: fontFamily.sans,
  fontWeight: fontWeight.normal,
  lineHeight: lineHeight.tight,
  fontSize: fontSize.xl,
};

export function Heading(props: HeadingProps) {
  return (
    <Text {...defaultProps} {...props}>
      {props.children}
    </Text>
  );
}
