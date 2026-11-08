import { css } from "@emotion/react";
import { LoginInformation } from "./components/LoginInformation";
import { LoginButton } from "./components/LoginButton";
import { LoginSubMenu } from "./components/LoginSubMenu";
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
        <LoginInformation
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />

        {/* <Password password={password} setPassword={setPassword} /> */}
        {error && <p>{error}</p>}

        <LoginButton />
        <LoginSubMenu />

      </form>
    </div>
  );
};

/*全体*/
const LoginStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px auto;
`;
