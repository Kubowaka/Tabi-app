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
  grid-template-columns: repeat(4, 180px);
  justify-content: center;
  column-gap: 12px;
  justify-items: center;

  @media (max-width: 768px) {
    gap: 16px;
    grid-template-columns: repeat(3, 180px);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    grid-template-columns: repeat(2, 180px);
  }
`;
