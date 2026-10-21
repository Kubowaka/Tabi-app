/// しおりの予定を追加するページ ///

import { css } from "@emotion/react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createSchedule, updateSchedule } from "../../services/planService";
import { ScheduleForm } from "./components/ScheduleForm";
import { ProceedButtonBox } from "./components/ProceedButtonBox";


export const AddPlanSchedule = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const planId = location.state?.planId;
  const scheduleId = location.state?.scheduleId;
  const favorite = location.state?.favorite;
  const planTitle = location.state?.planTitle || "";

  ///しおり入力///
  const [day, setDay] = useState(location.state?.day || "");
  const [title, setTitle] = useState(
    location.state?.title || location.state?.favorite?.name || "",
  );
  const [startTime, setStartTime] = useState(location.state?.startTime || "");
  const [endTime, setEndTime] = useState(location.state?.endTime || "");
  const [memo, setMemo] = useState(location.state?.memo || "");

  /// 保存処理時 ///
  const handleSave = async () => {
    if (!planId) {
      alert("しおり情報が見つかりません");
      return;
    }

    try {
      if (scheduleId) {
        // 再編集の場合
        await updateSchedule(scheduleId, day, title, startTime, endTime, memo);
      } else {
        // 新規追加の場合
        await createSchedule(planId, day, title, startTime, endTime, memo);
      }

      navigate("/plan-make", {
        state: {
          planId: planId,
          title: planTitle,
          startDate: location.state?.startDate || "",
          endDate: location.state?.endDate || "",
        },
      }); 
    } catch (error) {
      console.error("予定の保存に失敗しました:", error);
      alert("予定の保存に失敗しました");
    }
  };

  /// キャンセル処理 ///
  const handleCancel = () => {
    navigate("/plan-make", {
      state: {
        planId: planId,
        title: planTitle,
        startDate: location.state?.startDate || "",
        endDate: location.state?.endDate || "",
      },
    });
  };

  /// お気に入りからの追加処理 ///
  const handleAddFavorite = () => {
    navigate("/Favlist", {
      state: {
        from: "add-plan-schedule",
        planId: planId,
        day: day,
        startTime: startTime,
        endTime: endTime,
        memo: memo,
      },
    });
  };

  return (
    <div css={pageStyle}>
      {/* 予定追加のキャンセル */}
      <button css={closeButtonStyle} onClick={handleCancel} type="button">
        ✕
      </button>

      <h2 css={titleStyle}>{scheduleId ? "予定を再編集" : "予定を追加"}</h2>

      {/*お気に入り選択時のタイトル表示*/}
      {favorite && <p>選択したスポット：{favorite.name}</p>}

      <ScheduleForm
        day={day}
        startDate={location.state?.startDate || ""}
        endDate={location.state?.endDate || ""}
        title={title}
        startTime={startTime}
        endTime={endTime}
        memo={memo}

        // 変更後 //
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
