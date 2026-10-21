/// 新しいしおり作成時のモーダル ///

import { css } from "@emotion/react";
import { useState } from "react";

type CreateScheduleModalProps = {
  onClose: () => void;
  onSave: (title: string, startDate: string, endDate: string) => void;
};

const CreateScheduleModal = ({ onClose, onSave }: CreateScheduleModalProps) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      alert("タイトルを入力してください");
      return;
    }

    onSave(title, startDate, endDate);
  };

  return (
    <div css={overlayStyle}>
      <div css={modalStyle}>
        <h2 css={titleStyle}>新しいしおりの作成</h2>

        <label css={labelStyle}>タイトル</label>

        <input
          css={inputStyle}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例：東京旅行"
        />

        <label css={labelStyle}>始まり</label>

        <input
          css={inputStyle}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label css={labelStyle}>終わり</label>

        <input
          css={inputStyle}
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <div css={buttonStyle}>
          <button type="button" css={cancelButtonStyle} onClick={onClose}>
            キャンセル
          </button>

          <button type="button" css={saveButtonStyle} onClick={handleSave}>
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateScheduleModal;

/* =========================
   モーダルの背景
========================= */

const overlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.5);

  z-index: 1000;
`;

/* =========================
   モーダル本体
========================= */

const modalStyle = css`
  width: 280px;

  padding: 24px 20px;

  box-sizing: border-box;

  background-color: #ffffff;

  border-radius: 12px;

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
`;

/* =========================
   タイトル
========================= */

const titleStyle = css`
  margin: 0 0 20px;

  text-align: center;

  color: #222222;

  font-size: 18px;
  font-weight: bold;
`;

/* =========================
   ラベル
========================= */

const labelStyle = css`
  display: block;

  margin-bottom: 8px;

  color: #333333;

  font-size: 13px;
  font-weight: bold;
`;

/* =========================
   入力欄
========================= */

const inputStyle = css`
  width: 100%;

  padding: 10px;

  box-sizing: border-box;

  border: 1px solid #cccccc;
  border-radius: 6px;

  font-size: 14px;

  outline: none;

  &:focus {
    border-color: #8ed3df;
  }
`;

/* =========================
   ボタン
========================= */

const buttonStyle = css`
  display: flex;

  justify-content: center;

  gap: 10px;

  margin-top: 20px;
`;

/* =========================
   キャンセル
========================= */

const cancelButtonStyle = css`
  padding: 8px 14px;

  border: 1px solid #cccccc;
  border-radius: 6px;

  background-color: #ffffff;

  color: #555555;

  font-size: 12px;

  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

/* =========================
   保存
========================= */

const saveButtonStyle = css`
  padding: 8px 18px;

  border: none;
  border-radius: 6px;

  background-color: #ffbf00;

  color: #ffffff;

  font-size: 12px;
  font-weight: bold;

  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`;
