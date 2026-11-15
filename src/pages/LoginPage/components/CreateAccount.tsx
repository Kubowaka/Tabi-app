import { css } from "@emotion/react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../firebase";

export const CreateAccount = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password || !confirmPassword) {
      setError("すべての項目を入力してください");
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      return;
    }

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    setLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        password,
      );

      await setDoc(doc(db, "users", credential.user.uid), {
        email: credential.user.email,
        createdAt: serverTimestamp(),
      });

      alert("会員登録が完了しました！");
      navigate("/plan-list", { replace: true });
    } catch (error) {
      console.error("会員登録に失敗しました:", error);

      const errorCode =
        error instanceof Error && "code" in error ? error.code : "";

      if (errorCode === "auth/email-already-in-use") {
        setError("このメールアドレスは既に登録されています");
      } else if (errorCode === "auth/invalid-email") {
        setError("メールアドレスの形式が正しくありません");
      } else if (errorCode === "auth/weak-password") {
        setError("パスワードが弱すぎます。別のパスワードを設定してください");
      } else {
        setError("会員登録に失敗しました。時間をおいて再度お試しください");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div css={pageStyle}>
      <form css={formStyle} onSubmit={handleSubmit}>
        <label>メールアドレス</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          autoComplete="email"
          required
          disabled={loading}
        />

        <label>パスワード</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="6文字以上"
          autoComplete="new-password"
          required
          disabled={loading}
        />

        <label>パスワード（確認用）</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
          disabled={loading}
        />

        {error && <p css={errorStyle}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "登録中..." : "会員登録"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          disabled={loading}
        >
          ログイン画面へ戻る
        </button>
      </form>
    </div>
  );
};

const pageStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 16px;
`;

const formStyle = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 243px;

  label {
    color: #555;
    font-size: 14px;
  }

  input {
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  button {
    padding: 12px;
    border: none;
    border-radius: 8px;
    background: #ffb900;
    color: white;
    font-weight: bold;
    cursor: pointer;

    &:hover:not(:disabled) {
      opacity: 0.7;
      text-decoration: underline;
      color: #fcfcfc;
    }
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const errorStyle = css`
  color: #e53935;
  font-size: 13px;
`;
