/*パスワード忘れ＆新規会員登録*/

import { css } from "@emotion/react";

export const LoginSubMenu = () => {
  return (
    <div css={subMenuStyle}>
      <a css={subMenuLinkStyle} href="/forgot-password">
        パスワードを忘れた方はこちら
      </a>

      <a css={subMenuLinkStyle} href="/create-account">
        新規会員登録はこちら
      </a>
    </div>
  );
};

const subMenuStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const subMenuLinkStyle = css`
  font-size: 14px;
  color: #5b5b5b;
  text-decoration: none;

  &:hover {
    opacity: 0.7;
    text-decoration: underline;
    color: #e2a024;
  }
`;
