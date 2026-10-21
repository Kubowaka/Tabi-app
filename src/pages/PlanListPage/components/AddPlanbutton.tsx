import { css } from "@emotion/react";

type AddPlanbuttonProps = {
  onClick: () => void;
};

export const AddPlanbutton = ({ onClick }: AddPlanbuttonProps) => {
  return (
    <button css={buttonStyle} onClick={onClick} type="button">
      ＋ 新しいしおりを作成
    </button>
  );
};

/* =========================
   ボタン
========================= */

const buttonStyle = css`
  display: block;

  margin: 0 auto 16px;

  padding: 9px 20px;

  border: none;
  border-radius: 30px;

  background-color: #ffbf00;

  color: #ffffff;

  font-size: 14px;
  font-weight: bold;

  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`;
