import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PlanTitle } from "./components/PlanTitle";
import { PlanDate } from "./components/PlanDate";
import { PlanDayTabs } from "./components/PlanDayTabs";
import { PlanListBasesheet } from "./components/PlanListBasesheet";
import {
  getSchedules,
  deleteSchedule,
  updatePlanTitle,
  updatePlanDates,
} from "../../services/planService";

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

  const initialTitle = location.state?.title || "入力欄";
  const startDate = location.state?.startDate || "";
  const endDate = location.state?.endDate || "";
  const planId = location.state?.planId;

  const [title, setTitle] = useState(initialTitle);
  const [selectedDate, setSelectedDate] = useState("すべて");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [savingTitle, setSavingTitle] = useState(false);
  const [savingDates, setSavingDates] = useState(false);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  // 旅行タイトルを保存
  const handleTitleSave = async (newTitle: string) => {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      alert("旅行タイトルを入力してください");
      return;
    }

    if (!planId) {
      alert("旅行プランの情報が見つかりません。一覧から開き直してください。");
      return;
    }

    try {
      setSavingTitle(true);
      await updatePlanTitle(planId, trimmedTitle);

      setTitle(trimmedTitle);

      // 一覧に戻ったときに新しいタイトルを渡す
      navigate(location.pathname, {
        replace: true,
        state: {
          ...location.state,
          title: trimmedTitle,
          startDate,
          endDate,
          planId,
        },
      });
    } catch (error) {
      console.error("旅行タイトルの保存に失敗しました:", error);
      alert("旅行タイトルを保存できませんでした。もう一度お試しください。");
      throw error;
    } finally {
      setSavingTitle(false);
    }
  };

  // 旅行日付を保存
  const handleDatesSave = async (newStartDate: string, newEndDate: string) => {
    if (!planId) {
      alert("旅行プランの情報が見つかりません。一覧から開き直してください。");
      throw new Error("planIdがありません");
    }

    if (newEndDate < newStartDate) {
      alert("終わりの日は、始まりの日以降にしてください");
      throw new Error("日付の順番が正しくありません");
    }

    try {
      setSavingDates(true);

      await updatePlanDates(planId, newStartDate, newEndDate);

      // 画面上の日付と、次の画面へ渡す日付を更新
      navigate(location.pathname, {
        replace: true,
        state: {
          ...location.state,
          title,
          startDate: newStartDate,
          endDate: newEndDate,
          planId,
        },
      });
    } catch (error) {
      console.error("旅行日付の保存に失敗しました:", error);
      alert("旅行日付を保存できませんでした。もう一度お試しください。");
      throw error;
    } finally {
      setSavingDates(false);
    }
  };

  // 旅行日数を計算
  const getDayCount = () => {
    if (!startDate || !endDate) return 1;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 1;
    }

    const startDay = Date.UTC(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
    );
    const endDay = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

    return Math.max(1, Math.floor((endDay - startDay) / 86400000) + 1);
  };

  const dayCount = getDayCount();
  const dates = [
    "すべて",
    ...Array.from({ length: dayCount }, (_, index) => `${index + 1}日目`),
  ];

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

  const filteredSchedules = (
    selectedDate === "すべて"
      ? schedules
      : schedules.filter((schedule) => schedule.day === selectedDate)
  ).sort((a, b) => {
    // まず旅行の日数順に並べる
    const dayA = Number.parseInt(a.day, 10);
    const dayB = Number.parseInt(b.day, 10);

    if (dayA !== dayB) {
      return dayA - dayB;
    }

    // 同じ日なら開始時刻が早い順に並べる
    return a.startTime.localeCompare(b.startTime);
  });

  const handleAddSchedule = () => {
    navigate("/add-plan-schedule", {
      state: {
        planId,
        planTitle: title,
        startDate,
        endDate,
      },
    });
  };

  const handleEditSchedule = (schedule: Schedule) => {
    navigate("/add-plan-schedule", {
      state: {
        planId,
        scheduleId: schedule.id,
        day: schedule.day,
        title: schedule.title,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        memo: schedule.memo,
      },
    });
  };

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
      <PlanTitle title={title} onSave={handleTitleSave} saving={savingTitle} />

      <PlanDate
        startDate={startDate}
        endDate={endDate}
        onSave={handleDatesSave}
        saving={savingDates}
      />

      <PlanDayTabs
        dates={dates}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

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

      <div css={buttonAreaStyle}>
        <button
          css={backButtonStyle}
          onClick={() => navigate("/plan-list")}
          type="button"
        >
          ↩
        </button>

        <button css={plusButtonStyle} onClick={handleAddSchedule} type="button">
          ＋
        </button>
      </div>
    </div>
  );
};

const pageStyle = css`
  position: relative;
  min-height: calc(100vh - 124px);
  margin: 10px 14px 20px;
  padding: 16px 12px 100px;
  box-sizing: border-box;
  background-color: #ffffff;
  border: 1px solid #9dd8e3;
  border-radius: 6px;
`;
const buttonAreaStyle = css`
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px 12px;
  box-sizing: border-box;
  pointer-events: none;
`;

const plusButtonStyle = css`
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border: none;
  border-radius: 50%;
  background-color: #ffbf00;
  color: #ffffff;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  pointer-events: auto;

  &:hover {
    opacity: 0.85;
  }
`;

const backButtonStyle = css`
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border: none;
  border-radius: 50%;
  background-color: #ffbf00;
  color: #ffffff;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  pointer-events: auto;

  &:hover {
    opacity: 0.85;
  }
`;
