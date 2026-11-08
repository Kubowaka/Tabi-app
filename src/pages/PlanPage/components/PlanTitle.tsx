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

  useEffect(() => {
    setEditTitle(title);
  }, [title]);

  const handleSave = async () => {
    const trimmedTitle = editTitle.trim();

    if (!trimmedTitle) {
      alert("旅行タイトルを入力してください");
      return;
    }

    try {
      await onSave(trimmedTitle);
      setIsEditing(false);
    } catch {
      // 保存に失敗した場合は編集画面を閉じず、再試行できるようにする
    }
  };

  const handleCancel = () => {
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
              if (event.key === "Enter" && !saving) {
                void handleSave();
              }
              if (event.key === "Escape" && !saving) {
                handleCancel();
              }
            }}
            autoFocus
            disabled={saving}
            aria-label="旅行タイトル"
          />

          <button
            css={cancelButtonStyle}
            onClick={handleCancel}
            type="button"
            disabled={saving}
          >
            キャンセル
          </button>

          <button
            css={saveButtonStyle}
            onClick={() => void handleSave()}
            type="button"
            disabled={saving}
          >
            {saving ? "保存中…" : "保存"}
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

/* 入力欄・キャンセル・保存を横一列に配置 */
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

  &:hover {
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
