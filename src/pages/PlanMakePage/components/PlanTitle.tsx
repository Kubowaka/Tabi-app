import { css } from "@emotion/react";

type PlanTitleProps = {
  title: string;
};

export const PlanTitle = ({ title }: PlanTitleProps) => {
  return <div css={titleStyle}>{title}</div>;
};

/* =========================
   旅行タイトル
========================= */

const titleStyle = css`
  text-align: center;

  color: #222222;

  font-size: 20px;
  font-weight: bold;

  line-height: 1.4;
`;
