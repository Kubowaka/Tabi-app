import { css } from "@emotion/react";

type PlanDayTabsProps = {
  dates: string[];
  selectedDate: string;
  onDateChange: (date: string) => void;
};

export const PlanDayTabs = ({
  dates,
  selectedDate,
  onDateChange,
}: PlanDayTabsProps) => {
  return (
    <div css={listStyle}>
      {dates.map((date) => (
        <button
          key={date}
          type="button"
          css={selectedDate === date ? activeButtonStyle : buttonStyle}
          onClick={() => onDateChange(date)}
        >
          {date}
        </button>
      ))}
    </div>
  );
};


const listStyle = css`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  overflow-x: auto;
`;

const buttonStyle = css`
  min-width: 70px;
  padding: 8px 12px;
  border: 1px solid #91d9e6;
  border-radius: 20px;
  background-color: #ffffff;
  color: #222222;
  font-size: 13px;
  font-weight: bold;
  white-space: nowrap;
  cursor: pointer;
`;

const activeButtonStyle = css`
  min-width: 70px;
  padding: 8px 12px;
  border: 1px solid #91d9e6;
  border-radius: 20px;
  background-color: #91d9e6;
  color: #ffffff;
  font-size: 13px;
  font-weight: bold;
  white-space: nowrap;
  cursor: pointer;
`;
