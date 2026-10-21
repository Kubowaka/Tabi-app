/// しおりを開いた一覧ページ///

import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PlanTitle } from "./components/PlanTitle";
import { PlanDate } from "./components/PlanDate";
import { PlanDayTabs } from "./components/PlanDayTabs";
import { PlanListBasesheet } from "./components/PlanListBasesheet";
import { getSchedules, deleteSchedule } from "../../services/planService";

type Schedule = {
  id: string;
  day: string;
  title: string;
  startTime: string;
  endTime: string;
  memo: string;
};

export const PlanMake = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const title = location.state?.title || "入力欄";
  const startDate = location.state?.startDate || "";
  const endDate = location.state?.endDate || "";
  const planId = location.state?.planId;

  const [selectedDate, setSelectedDate] = useState("すべて");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const loadSchedules = async () => {
      if (!planId) return;

      try {
        const data = await getSchedules(planId);
        setSchedules(data as Schedule[]);
      } catch (error) {
        console.error("予定の取得に失敗しました:", error);
      }
    };

    loadSchedules();
  }, [planId]);

  // 表示する予定を絞り込み
  const filteredSchedules = (
    selectedDate === "すべて"
      ? schedules
      : schedules.filter((schedule) => schedule.day === selectedDate)
  ).sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  const handleAddSchedule = () => {
    navigate("/add-plan-schedule", {
      state: {
        planId: planId,
        planTitle: title,
        startDate: startDate,
        endDate: endDate,
      },
    });
  };

  // 予定の再編集処理
  const handleEditSchedule = (schedule: Schedule) => {
    navigate("/add-plan-schedule", {
      state: {
        planId: planId,
        scheduleId: schedule.id,
        day: schedule.day,
        title: schedule.title,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        memo: schedule.memo,
      },
    });
  };

  // 予定の削除処理
  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!window.confirm("この予定を削除しますか？")) {
      return;
    }

    try {
      await deleteSchedule(scheduleId);

      setSchedules((currentSchedules) =>
        currentSchedules.filter(
          (currentSchedule) => currentSchedule.id !== scheduleId,
        ),
      );

      setOpenMenuId(null);
    } catch (error) {
      console.error("予定の削除に失敗しました:", error);
      alert("予定の削除に失敗しました");
    }
  };

  return (
    <div css={pageStyle}>
      {/* 旅行タイトル */}
      <PlanTitle title={title} />

      {/* 旅行日程 */}
      <PlanDate date={`${startDate} ～ ${endDate}`} />

      {/* 日付タブ */}
      <PlanDayTabs
        dates={["すべて", "1日目", "2日目", "3日目"]}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* 予定一覧 */}
      <PlanListBasesheet
        schedules={filteredSchedules}
        startDate={startDate}
        openMenuId={openMenuId}
        onMenuToggle={(scheduleId) => {
          setOpenMenuId(openMenuId === scheduleId ? null : scheduleId);
        }}
        onEdit={handleEditSchedule}
        onDelete={handleDeleteSchedule}
      />

      {/* 予定追加ボタン */}
      <button css={plusButtonStyle} onClick={handleAddSchedule} type="button">
        ＋
      </button>

      <button
        css={backButtonStyle}
        onClick={() => navigate("/plan-list")}
        type="button"
      >
        ↩
      </button>
    </div>
  );
};

const pageStyle = css`
  min-height: calc(100vh - 124px);
  padding: 24px 20px 100px;
  box-sizing: border-box;
  background-color: #ffffff;
`;

const plusButtonStyle = css`
  position: fixed;
  right: 24px;
  bottom: 90px;

  width: 52px;
  height: 52px;

  border: none;
  border-radius: 50%;

  background-color: #ffbf00;
  color: #ffffff;

  font-size: 28px;
  font-weight: bold;

  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`;

const backButtonStyle = css`
  position: fixed;
  left: 24px;
  bottom: 90px;

  width: 52px;
  height: 52px;

  border: none;
  border-radius: 50%;

  background-color: #ffbf00;
  color: #ffffff;

  font-size: 28px;
  font-weight: bold;

  cursor: pointer;
`;
