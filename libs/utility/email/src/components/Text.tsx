import { MjmlText } from "@faire/mjml-react";
import cx from "classnames";
import * as React from "react";

type TextProps = {
  maxWidth?: number;
} & React.ComponentProps<typeof MjmlText>;

export function Text({ children, maxWidth, ...props }: TextProps) {
  if (maxWidth) {
    return (
      <MjmlText {...props} cssClass={cx("button", props.cssClass)}>
        <div style={{ maxWidth }}>{children}</div>
      </MjmlText>
    );
  } else
    return (
      <MjmlText {...props} cssClass={cx("button", props.cssClass)}>
        {children}
      </MjmlText>
    );
}
