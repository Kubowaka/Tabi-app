import { css } from "@emotion/react";

type PlanDateProps = {
  date: string;
};

export const PlanDate = ({ date }: PlanDateProps) => {
  return <div css={dateStyle}> {date}</div>;
};

const dateStyle = css`
  text-align: center;
  color: #222222;
  font-size: 13px;
  font-weight: bold;
  line-height: 1.4;
`;
