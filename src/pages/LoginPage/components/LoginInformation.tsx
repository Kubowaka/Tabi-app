/* メールアドレス・パスワード入力欄 */

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
      {/* メールアドレス */}
      <div css={inputAreaStyle}>
        <label htmlFor="email">メールアドレス</label>
        <input
          css={inputStyle}
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* パスワード */}
      <div css={inputAreaStyle}>
        <label htmlFor="password">パスワード</label>
        <input
          css={inputStyle}
          id="password"
          name="password"
          type="password"
          placeholder="パスワードを入力"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
