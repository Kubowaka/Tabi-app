import {UserName}from './components/UserName';
import {Password}from './components/Password';
import {RememberMe}from './components/Remenber';
import {LoginButton}from './components/LoginButton';

export const Login = () => {
  return (
    <div> 
      <h1>ログイン</h1>

      <UserName />
      <Password />
      <RememberMe />
      <LoginButton />

      <a href="/forgot-password">パスワードを忘れた方はこちら</a>
    </div>
  );
};