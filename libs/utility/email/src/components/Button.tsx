import { MjmlButton } from "@faire/mjml-react";
import cx from "classnames";
import React from "react";
import { borderRadius, colors, fontSize, fontWeight, lineHeight } from "../theme";

type ButtonProps = React.ComponentProps<typeof MjmlButton>;

export default function Button(props: ButtonProps) {
  return (
    <MjmlButton
      lineHeight={lineHeight.tight}
      fontSize={fontSize.base}
      fontWeight={fontWeight.medium}
      innerPadding="12px 20px"
      align="left"
      backgroundColor={colors.blue}
      color={colors.black}
      borderRadius={borderRadius.sm}
      cssClass={cx("button", props.cssClass)}
      {...props}
    />
  );
}
