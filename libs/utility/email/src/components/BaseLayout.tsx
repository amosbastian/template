import { Mjml, MjmlAll, MjmlAttributes, MjmlBody, MjmlFont, MjmlHead, MjmlStyle } from "@faire/mjml-react";
import React from "react";
import { borderRadius, colors, screens, spacing, themeDefaults } from "../theme";

type BaseLayoutProps = {
  width?: number;
  style?: string;
  children: React.ReactNode;
};

export default function BaseLayout({ width, children, style }: BaseLayoutProps) {
  return (
    <Mjml>
      <MjmlHead>
        <MjmlFont name="neue-haas-unica" href="https://use.typekit.net/qqd8jtb.css" />
        <MjmlAttributes>
          <MjmlAll {...themeDefaults} />
        </MjmlAttributes>
        <MjmlStyle>{`
          body {
            -webkit-font-smoothing: antialiased;
            min-width: 320px;
            width: 100%;
            max-width: 460px;
            margin: 40px auto;
          }

          body > div {
            background-color: ${colors.white};
            border: 1px solid ${colors.border};
            border-radius: ${borderRadius.md}px;
            overflow: hidden;
            padding: 40px 0;
          }

          a {
            color: inherit
          }
          
          .gutter {
            padding-left: ${spacing.s7}px;
            padding-right: ${spacing.s7}px;
          }
          
          .no-wrap {
            white-space: nowrap;
          }
          
          .hidden {
            display: none;
            max-width: 0px;
            max-height: 0px;
            overflow: hidden;
            mso-hide: all;
          }
          
          .lg-hidden {
            display: none;
            max-width: 0px;
            max-height: 0px;
            overflow: hidden;
            mso-hide: all;
          }

          @media (min-width:${screens.xs}) {
            .gutter {
              padding-left: ${spacing.s9}px;
              padding-right: ${spacing.s9}px;
            }
            
            .sm-hidden {
              display: none;
              max-width: 0px;
              max-height: 0px;
              overflow: hidden;
              mso-hide: all;
            }
            
            .lg-hidden {
              display: block !important;
              max-width: none !important;
              max-height: none !important;
              overflow: visible !important;
              mso-hide: none !important;
            }
          }

          ${style}
      `}</MjmlStyle>
      </MjmlHead>
      <MjmlBody width={width}>{children}</MjmlBody>
    </Mjml>
  );
}
