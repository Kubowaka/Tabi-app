import { css } from "@emotion/react";

type PlanScheduleProps = {
  dayLabel: string;
  time: string;
  title: string;
  place?: string;
};

export const PlanSchedule = ({
  dayLabel,
  time,
  title,
  place,
}: PlanScheduleProps) => {
  return (
    <div css={scheduleStyle}>
      <div css={timeStyle}>
        <div>{dayLabel}</div>
        <div css={timeTextStyle}>{time}</div>
      </div>

      <div css={contentStyle}>
        <h3>{title}</h3>

        {place && <p>📍 {place}</p>}
      </div>
    </div>
  );
};

const scheduleStyle = css`
  display: flex;
  width: 100%;
  min-height: 70px;
  box-sizing: border-box;
  padding: 12px 16px;
  border: 1px solid #91d9e6;
  border-radius: 8px;
  background-color: #ffffff;
`;

const timeStyle = css`
  width: 65px;
  flex-shrink: 0;
  color: #222222;
  font-size: 13px;
  font-weight: bold;
`;

const contentStyle = css`
  flex: 1;

  h3 {
    margin: 0;
    color: #222222;
    font-size: 15px;
    font-weight: bold;
  }

  p {
    margin: 6px 0 0;
    color: #666666;
    font-size: 12px;
  }
`;

const timeTextStyle = css`
  margin-top: 6px;
  font-size: 13px;
  font-weight: normal;
`;
