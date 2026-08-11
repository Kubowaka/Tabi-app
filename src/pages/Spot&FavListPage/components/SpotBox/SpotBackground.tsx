import { css } from "@emotion/react";

type SpotBackgroundProps = {
  children: React.ReactNode;
};

export const SpotBackground = ({ children }: SpotBackgroundProps) => {
  return <section css={backgroundStyle}>{children}</section>;
};

const backgroundStyle = css`
  width: 100%;
  background: #fff5e2;
  padding: 24px 16px;
  border-radius: 20px;
`;
