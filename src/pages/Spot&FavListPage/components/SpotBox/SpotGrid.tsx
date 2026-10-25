import { css } from "@emotion/react";

type SpotGridProps = {
  children: React.ReactNode;
};

export const SpotGrid = ({ children }: SpotGridProps) => {
  return <div css={gridStyle}>{children}</div>;
};

const gridStyle = css`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(2, 180px);
  justify-content: center;
  column-gap: 12px;
  justify-items: center;

  /* アイパッド＆PC 3列 */
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px 5px;
    align-content: start;
    padding-inline: 12px;
  }

`;
