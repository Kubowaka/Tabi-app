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
          css={[buttonStyle, selectedDate === date && activeButtonStyle]}
          onClick={() => onDateChange(date)}
        >
          {date}
        </button>
      ))}
    </div>
  );
};

// CSS
const listStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
  width: 100%;
  max-width: 100%;
  padding: 0;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const buttonStyle = css`
  flex: 0 0 auto;
  min-width: 0;
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
  background-color: #91d9e6;
  color: #ffffff;
`;
