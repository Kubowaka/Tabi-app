// しおりのタイトル

import { css } from "@emotion/react";
import { useEffect, useState } from "react";

type PlanTitleProps = {
  title: string;
  onSave: (title: string) => Promise<void>;
  saving?: boolean;
};

export const PlanTitle = ({
  title,
  onSave,
  saving = false,
}: PlanTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setEditTitle(title);
  }, [title]);

  const isSaving = saving || isSubmitting;

  const handleSave = async () => {
    if (isSaving) return;

    const trimmedTitle = editTitle.trim();

    if (!trimmedTitle) {
      alert("旅行タイトルを入力してください");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(trimmedTitle);
      setIsEditing(false);
    } catch (error) {
      console.error("旅行タイトルの保存に失敗しました:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSaving) return;

    setEditTitle(title);
    setIsEditing(false);
  };

  return (
    <div css={titleAreaStyle}>
      {isEditing ? (
        <div css={editRowStyle}>
          <input
            css={inputStyle}
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !isSaving) {
                void handleSave();
              }

              if (event.key === "Escape" && !isSaving) {
                handleCancel();
              }
            }}
            autoFocus
            disabled={isSaving}
            aria-label="旅行タイトル"
          />

          <button
            css={cancelButtonStyle}
            onClick={handleCancel}
            type="button"
            disabled={isSaving}
          >
            キャンセル
          </button>

          <button
            css={saveButtonStyle}
            onClick={() => void handleSave()}
            type="button"
            disabled={isSaving}
          >
            {isSaving ? "保存中…" : "保存"}
          </button>
        </div>
      ) : (
        <div css={displayRowStyle}>
          <span css={titleTextStyle}>{title}</span>

          <button
            css={editButtonStyle}
            onClick={() => {
              setEditTitle(title);
              setIsEditing(true);
            }}
            type="button"
            aria-label="旅行タイトルを編集"
          >
            ✎
          </button>
        </div>
      )}
    </div>
  );
};

/* タイトル全体 */
const titleAreaStyle = css`
  width: 100%;
  margin-bottom: 4px;
  box-sizing: border-box;
`;

/* 入力欄・キャンセル・保存 */
const editRowStyle = css`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  box-sizing: border-box;
`;

/* タイトル入力欄 */
const inputStyle = css`
  flex: 1;
  min-width: 0;
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #333333;
  border-radius: 6px;
  background: #ffffff;
  color: #222222;
  font-size: 14px;
  box-sizing: border-box;
  outline-color: #91d9e6;
`;

/* キャンセルボタン */
const cancelButtonStyle = css`
  flex-shrink: 0;
  padding: 7px 10px;
  border: 1px solid #dddddd;
  border-radius: 18px;
  background: #ffffff;
  color: #666666;
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* 保存ボタン */
const saveButtonStyle = css`
  flex-shrink: 0;
  padding: 7px 12px;
  border: none;
  border-radius: 18px;
  background: #ffbf00;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
  cursor: pointer;

  &:hover:not(:disabled) {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* 通常時のタイトル表示 */
const displayRowStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const titleTextStyle = css`
  color: #222222;
  font-size: 20px;
  font-weight: bold;
  line-height: 1.4;
  overflow-wrap: anywhere;
`;

const editButtonStyle = css`
  padding: 2px 5px;
  border: none;
  background: transparent;
  color: #777777;
  font-size: 18px;
  cursor: pointer;
`;
