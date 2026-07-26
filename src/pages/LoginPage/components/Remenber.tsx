/*ログイン状態保持のボタン*/

export const RememberMe = () => {
  return (
    <div>
      <input type="checkbox" id="remember" />
      <label htmlFor="remember">ログイン状態を保持する</label>
    </div>
  );
};