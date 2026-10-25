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
  padding-block: 16px;
  box-sizing: border-box;

  /* PC版のみ */
  @media (min-width: 768px) {
    width: 90%;
    /* max-width: 1000px; */
    height: 700px;
    margin: 12px auto 24px;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);

    overflow-y: auto;
    overflow-x: hidden;
  }
`;
