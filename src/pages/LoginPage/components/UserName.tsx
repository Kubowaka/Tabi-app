/*ユーザーネーム入力欄*/
import { css } from "@emotion/react";
export const UserName = ({ email, setEmail }) => {
  return (
    <div css={UserNameStyle}>
      <label htmlFor="username">ユーザー名</label>
      <input
        css={NameInputStyle}
        id="username"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  );
};

/*全体*/
const UserNameStyle = css`
  display: flex;
  flex-direction: column;
  width: 243px;
  text-align: left;
`;

/*入力ボックス*/
const NameInputStyle = css`
  padding: 10px;
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  margin: 8px 0 16px;
`;
