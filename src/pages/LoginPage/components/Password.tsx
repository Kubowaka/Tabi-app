/*パスワード入力欄*/
import { css } from "@emotion/react";
export const Password = ({ password, setPassword }) => {
  return (
    <div css={PasswordStyle}>
      <label htmlFor="password">パスワード</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  );
};

/*全体*/
const PasswordStyle = css`
  display: flex;
  flex-direction: column;
  width: 243px;
  text-align: left;
`;

/*入力ボックス*/
const PasswordInputStyle = css`
  padding: 10px;
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  margin: 8px 0 16px;
`;
