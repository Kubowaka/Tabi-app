// しおりの日付入力

import { css } from "@emotion/react";
import { useEffect, useState } from "react";

type PlanDateProps = {
  startDate: string;
  endDate: string;
  title: string;
  onSave: (title: string, startDate: string, endDate: string) => Promise<void>;
  saving?: boolean;
};

export const PlanDate = ({
  startDate,
  endDate,
  title,
  onSave,
  saving = false,
}: PlanDateProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editStartDate, setEditStartDate] = useState(startDate);
  const [editEndDate, setEditEndDate] = useState(endDate);

  useEffect(() => {
    setEditStartDate(startDate);
    setEditEndDate(endDate);
  }, [startDate, endDate]);

  const handleSave = async () => {
    if (!editStartDate || !editEndDate) {
      alert("始まりと終わりの日付を入力してください");
      return;
    }

    if (editEndDate < editStartDate) {
      alert("終わりの日は、始まりの日以降にしてください");
      return;
    }

    try {
      await onSave(title, editStartDate, editEndDate);
      setIsEditing(false);
    } catch {
      // 保存に失敗した場合は編集画面を開いたままにする
    }
  };

  const handleCancel = () => {
    setEditStartDate(startDate);
    setEditEndDate(endDate);
    setIsEditing(false);
  };

  return (
    <div css={dateAreaStyle}>
      {isEditing ? (
        <div css={editAreaStyle}>
          <label css={labelStyle}>
            始まり
            <input
              css={inputStyle}
              type="date"
              value={editStartDate}
              onChange={(event) => setEditStartDate(event.target.value)}
              disabled={saving}
            />
          </label>

          <label css={labelStyle}>
            終わり
            <input
              css={inputStyle}
              type="date"
              value={editEndDate}
              onChange={(event) => setEditEndDate(event.target.value)}
              disabled={saving}
            />
          </label>

          <div css={buttonAreaStyle}>
            <button
              type="button"
              css={cancelButtonStyle}
              onClick={handleCancel}
              disabled={saving}
            >
              キャンセル
            </button>
            <button
              type="button"
              css={saveButtonStyle}
              onClick={() => void handleSave()}
              disabled={saving}
            >
              {saving ? "保存中…" : "保存"}
            </button>
          </div>
        </div>
      ) : (
        <div css={displayAreaStyle}>
          <span>
            {startDate} ～ {endDate}
          </span>
          <button
            type="button"
            css={editButtonStyle}
            onClick={() => setIsEditing(true)}
            aria-label="旅行日程を編集"
          >
            ✎
          </button>
        </div>
      )}
    </div>
  );
};

const dateAreaStyle = css`
  text-align: center;
  color: #222222;
  font-size: 13px;
  font-weight: bold;
  line-height: 1.4;
`;

const displayAreaStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const editButtonStyle = css`
  padding: 0;
  border: none;
  background: transparent;
  color: #777777;
  cursor: pointer;
  font-size: 15px;
`;

const editAreaStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
`;

const labelStyle = css`
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: left;
`;

const inputStyle = css`
  padding: 8px;
  border: 1px solid #cccccc;
  border-radius: 6px;
  font-size: 14px;
`;

const buttonAreaStyle = css`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const cancelButtonStyle = css`
  padding: 8px 12px;
  border: 1px solid #cccccc;
  border-radius: 6px;
  background: #ffffff;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const saveButtonStyle = css`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #ffbf00;
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
