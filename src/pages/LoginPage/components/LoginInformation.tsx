/*ユーザーネーム&パスワード入力欄*/
import { css } from "@emotion/react";

type LoginInformationProps = {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
};

export const LoginInformation = ({
  email,
  setEmail,
  password,
  setPassword,
}: LoginInformationProps) => {
  return (
    <div css={formStyle}>
      {/* ユーザー名 */}
      <div css={inputAreaStyle}>
        <label htmlFor="username">ユーザー名</label>
        <input
          css={inputStyle}
          id="username"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* パスワード */}
      <div css={inputAreaStyle}>
        <label htmlFor="password">パスワード</label>
        <input
          css={inputStyle}
          id="password"
          type="password"
          placeholder="パスワードを入力"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
    </div>
  );
};

const formStyle = css`
  display: flex;
  flex-direction: column;
  width: 243px;
`;

const inputAreaStyle = css`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const inputStyle = css`
  padding: 10px;
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  margin: 8px 0;
`;
