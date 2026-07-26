/*ログインボタン*/

import { css } from "@emotion/react";
export const LoginButton = () => {
  return (
    <div css={LoginButtonAreaStyle}>
      <button css={LoginButtonStyle} type="submit">
        ログイン
      </button>
    </div>
  );
};

const LoginButtonAreaStyle = css`
  display: flex;
  justify-content: center;
`;

const LoginButtonStyle = css`
  max-width: 100%;
  padding: 5px 80px;
  margin-block: 10px;
  color: white;
  border-radius: 10px;
  background: linear-gradient(
    90deg,
    #ffbf00 0%,
    #ffbf00 0%,
    #ffb24d 45%,
    #ff8f8f 100%
  );
  box-shadow: 0px 5px 5px #c89651;
  transition: 0.3s;

  border: 1px solid white;
  cursor: pointer;

  &:hover {
    box-shadow: unset;
    transform: translateY(4px);
  }
`;
