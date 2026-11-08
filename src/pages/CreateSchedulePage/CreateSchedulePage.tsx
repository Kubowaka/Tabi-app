/// しおりの予定を追加するページ ///

import { css } from "@emotion/react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createSchedule, updateSchedule } from "../../services/planService";
import { ScheduleForm } from "./components/ScheduleForm";
import { ProceedButtonBox } from "./components/ProceedButtonBox";

type LocationState = {
  planId?: string;
  scheduleId?: string;
  favorite?: {
    name?: string;
  };
  planTitle?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  day?: string;
  startTime?: string;
  endTime?: string;
  memo?: string;
  from?: string;
};

export const CreateSchedule = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 画面遷移時に渡された情報
  const state = location.state as LocationState | null;

  const planId = state?.planId;
  const scheduleId = state?.scheduleId;
  const favorite = state?.favorite;

  const planTitle = state?.planTitle || state?.title || "";
  const startDate = state?.startDate || "";
  const endDate = state?.endDate || "";

  // 予定入力欄
  const [day, setDay] = useState(state?.day || "");
  const [title, setTitle] = useState(
    state?.favorite?.name || state?.title || "",
  );
  const [startTime, setStartTime] = useState(state?.startTime || "");
  const [endTime, setEndTime] = useState(state?.endTime || "");
  const [memo, setMemo] = useState(state?.memo || "");

  // 保存処理
  const handleSave = async () => {
    if (!planId) {
      alert("しおり情報が見つかりません");
      return;
    }

    try {
      if (scheduleId) {
        // 既存の予定を更新
        await updateSchedule(scheduleId, day, title, startTime, endTime, memo);
      } else {
        // 新しい予定をFirebaseに保存
        await createSchedule(planId, day, title, startTime, endTime, memo);
      }

      // しおり画面へ戻る
      navigate("/plan-make", {
        state: {
          planId,
          title: planTitle,
          startDate,
          endDate,
        },
      });
    } catch (error) {
      console.error("予定の保存に失敗しました:", error);
      alert("予定の保存に失敗しました");
    }
  };

  // キャンセル処理
  const handleCancel = () => {
    navigate("/plan-make", {
      state: {
        planId,
        title: planTitle,
        startDate,
        endDate,
      },
    });
  };

  // お気に入り一覧へ移動
  const handleAddFavorite = () => {
    navigate("/Favlist", {
      state: {
        from: "add-plan-schedule",
        planId,
        planTitle,
        startDate,
        endDate,
        day,
        title,
        startTime,
        endTime,
        memo,
      },
    });
  };

  return (
    <div css={pageStyle}>
      <button css={closeButtonStyle} onClick={handleCancel} type="button">
        ✕
      </button>

      <h2 css={titleStyle}>{scheduleId ? "予定を再編集" : "予定を追加"}</h2>

      {favorite && <p>選択したスポット：{favorite.name}</p>}

      <ScheduleForm
        day={day}
        startDate={startDate}
        endDate={endDate}
        title={title}
        startTime={startTime}
        endTime={endTime}
        memo={memo}
        onDayChange={setDay}
        onTitleChange={setTitle}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
        onMemoChange={setMemo}
        onAddFavorite={handleAddFavorite}
      />

      <ProceedButtonBox onClick={handleSave} />
    </div>
  );
};

const pageStyle = css`
  min-height: calc(100vh - 124px);
  padding: 24px 20px 100px;
  box-sizing: border-box;
  background-color: #ffffff;
`;

const titleStyle = css`
  margin: 0 0 24px;
  text-align: center;
  color: #222222;
  font-size: 20px;
  font-weight: bold;
`;

const closeButtonStyle = css`
  position: absolute;
  top: 16px;
  right: 20px;

  width: 40px;
  height: 40px;

  padding: 0;
  border: none;
  background-color: transparent;

  color: #555555;
  font-size: 24px;
  font-weight: bold;

  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }
`;
