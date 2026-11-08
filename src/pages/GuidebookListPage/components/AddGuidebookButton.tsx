import { css } from "@emotion/react";

type AddPlanbuttonProps = {
  onClick: () => void;
};

export const AddPlanbutton = ({ onClick }: AddPlanbuttonProps) => {
  return (
    <div css={containerStyle}>
      <button css={buttonStyle} onClick={onClick} type="button">
        ＋ 新しいしおりを作成
      </button>
    </div>
  );
};

const containerStyle = css`
  position: sticky;
  top: 54px;
  z-index: 99;
  display: flex;
  justify-content: center;
  padding: 12px 0;
  background-color: #ffffff;
`;

const buttonStyle = css`
  display: block;
  margin: 0;
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
