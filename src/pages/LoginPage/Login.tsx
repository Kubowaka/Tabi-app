import { UserName } from "./components/UserName";
import { Password } from "./components/Password";
import { RememberMe } from "./components/Remenber";
import { LoginButton } from "./components/LoginButton";
import { css } from "@emotion/react";

export const Login = () => {
  return (
    <div css={LoginStyle}>
      <h1 css={LoginTitleStyle}>ログイン</h1>

      <UserName />
      <Password />
      <RememberMe />
      <LoginButton />

      <a css={ForgotPasswordStyle} href="/forgot-password">
        パスワードを忘れた方はこちら
      </a>
    </div>
  );
};

/*全体*/
const LoginStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/*タイトル*/
const LoginTitleStyle = css`
  font-size: 24px;
  margin-bottom: 16px;
`;

/*パスワードを忘れた方はこちら*/
const ForgotPasswordStyle = css`
  font-size: 14px;
  color: #ff6b6b;
  text-decoration: none;
`;
