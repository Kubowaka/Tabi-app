import { css } from "@emotion/react";
import { UserName } from "./components/UserName";
import { Password } from "./components/Password";
import { RememberMe } from "./components/Remenber";
import { LoginButton } from "./components/LoginButton";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./../../firebase";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      navigate("/spot-list");
      
    } catch (error) {
      console.error("ログイン失敗", error);
      setError("メールアドレスまたはパスワードが正しくありません");
    }
  };

  return (
    <div css={LoginStyle}>
      <form onSubmit={handleSubmit}>
        <h1 css={LoginTitleStyle}>ログイン</h1>

        <UserName email={email} setEmail={setEmail} />

        <Password password={password} setPassword={setPassword} />
        {error && <p>{error}</p>}
        <RememberMe />

        <LoginButton />

        <a css={ForgotPasswordStyle} href="/forgot-password">
          パスワードを忘れた方はこちら
        </a>
      </form>
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
