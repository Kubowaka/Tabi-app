/*ユーザーネーム入力欄*/

export const UserName = () => {
  return (
    <div>
        <label htmlFor="username">ユーザー名</label>
        <input
        id="username"
        type="email"
        placeholder="your@email.com"
        />
    </div>

  );
};