import { css } from "@emotion/react";
import { PlanSchedule } from "./PlanSchedule";

type Schedule = {
  id: string;
  day: string;
  title: string;
  startTime: string;
  endTime: string;
  memo: string;
};

type PlanScheduleListProps = {
  schedules: Schedule[];
  startDate: string;
  openMenuId: string | null;
  onMenuToggle: (scheduleId: string) => void;
  onEdit: (schedule: Schedule) => void;
  onDelete: (scheduleId: string) => void;
};

export const PlanListBasesheet = ({
  schedules,
  openMenuId,
  onMenuToggle,
  onEdit,
  onDelete,
}: PlanScheduleListProps) => {
const getDayLabel = (day: string) => {
  return day;
};

  if (schedules.length === 0) {
    return <p css={emptyMessageStyle}>予定はまだありません</p>;
  }

  return (
    <div css={scheduleAreaStyle}>
      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          css={[
            scheduleItemStyle,
            openMenuId === schedule.id && openScheduleItemStyle,
          ]}
        >
          <PlanSchedule
            dayLabel={getDayLabel(schedule.day)}
            time={`${schedule.startTime} ～ ${schedule.endTime}`}
            title={schedule.title || "予定"}
          />

          <div css={menuContainerStyle}>
            <button
              css={menuButtonStyle}
              onClick={() => onMenuToggle(schedule.id)}
              type="button"
            >
              ⋮
            </button>

            {openMenuId === schedule.id && (
              <div css={menuStyle}>
                <button
                  css={menuItemStyle}
                  onClick={() => onEdit(schedule)}
                  type="button"
                >
                  再編集
                </button>

                <button
                  css={menuItemStyle}
                  onClick={() => onDelete(schedule.id)}
                  type="button"
                >
                  削除
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const scheduleAreaStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`;

const emptyMessageStyle = css`
  margin: 40px 0;
  text-align: center;
  color: #999999;
  font-size: 14px;
`;

const scheduleItemStyle = css`
  position: relative;
`;

const openScheduleItemStyle = css`
  z-index: 30;
`;

const menuContainerStyle = css`
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  z-index: 20;
`;

const menuButtonStyle = css`
  width: 32px;
  height: 40px;
  padding: 0;
  border: none;
  background-color: transparent;
  color: #555555;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
`;

const menuStyle = css`
  position: absolute;
  top: 36px;
  right: 0;
  min-width: 80px;
  padding: 4px;
  border: 1px solid #dddddd;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 10;
`;

const menuItemStyle = css`
  width: 100%;
  padding: 8px 12px;
  border: none;
  background-color: #ffffff;
  color: #333333;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;
