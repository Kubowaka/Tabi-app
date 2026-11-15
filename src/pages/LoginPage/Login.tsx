import { css } from "@emotion/react";
import { LoginInformation } from "./components/LoginInformation";
import { LoginButton } from "./components/LoginButton";
import { LoginSubMenu } from "./components/LoginSubMenu";
import { useState, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("メールアドレスとパスワードを入力してください");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, password);

      navigate("/spot-list", { replace: true });
    } catch (error) {
      console.error("ログインに失敗しました:", error);

      const errorCode =
        typeof error === "object" && error !== null && "code" in error
          ? error.code
          : "";

      if (
        errorCode === "auth/invalid-credential" ||
        errorCode === "auth/user-not-found" ||
        errorCode === "auth/wrong-password"
      ) {
        setError("メールアドレスまたはパスワードが正しくありません");
      } else if (errorCode === "auth/too-many-requests") {
        setError(
          "ログイン試行回数が多すぎます。時間をおいて再度お試しください",
        );
      } else {
        setError("ログインに失敗しました。時間をおいて再度お試しください");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div css={LoginStyle}>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={loading} css={formDisabledStyle}>
          <LoginInformation
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />

          {error && <p css={errorStyle}>{error}</p>}

          <LoginButton />
          {loading && <p css={loadingStyle}>ログイン中...</p>}
          <LoginSubMenu />
        </fieldset>
      </form>
    </div>
  );
};

/* 全体 */
const LoginStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px auto;
`;

const formDisabledStyle = css`
  border: none;
  padding: 0;
  margin: 0;
  min-width: 0;

  &:disabled {
    opacity: 0.7;
  }
`;

const errorStyle = css`
  color: #e53935;
  font-size: 13px;
  text-align: center;
`;

const loadingStyle = css`
  color: #777;
  font-size: 13px;
  text-align: center;
`;
