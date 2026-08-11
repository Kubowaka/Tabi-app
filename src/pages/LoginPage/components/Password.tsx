/*パスワード入力欄*/
import { css } from "@emotion/react";
export const Password = () => {
  return (
    <div css={PasswordStyle}>
      <label htmlFor="password">パスワード</label>
      <input
        css={PasswordInputStyle}
        id="password"
        type="password"
        placeholder="パスワードを入力"
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
