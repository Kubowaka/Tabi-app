import { css } from "@emotion/react";

type ProceedButtonBoxProps = {
  onClick: () => void;
};

export const ProceedButtonBox = ({ onClick }: ProceedButtonBoxProps) => {
  return (
    <div css={buttonBoxStyle}>
      <button type="button" css={buttonStyle} onClick={onClick}>
        保存する
      </button>
    </div>
  );
};


const buttonBoxStyle = css`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const buttonStyle = css`
  width: 200px;
  padding: 12px 20px;
  border: none;
  border-radius: 30px;
  background-color: #ffbf00;
  color: #ffffff;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`;
