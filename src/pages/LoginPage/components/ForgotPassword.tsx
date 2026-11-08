/** @jsxImportSource @emotion/react */

import { useState } from "react";
import { css } from "@emotion/react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("メールアドレスを入力してください。");
      return;
    }

    try {
      setLoading(true);

      await sendPasswordResetEmail(auth, email.trim());

      setMessage("再設定メールを送信しました。メールをご確認ください。");
    } catch (err) {
      console.error(err);
      setError(
        "メールの送信に失敗しました。メールアドレスを確認してください。",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div css={styles.page}>
      <div css={styles.card}>
        <div css={styles.icon}>🔑</div>

        <h2 css={styles.title}>パスワード再設定</h2>

        <p css={styles.description}>
          パスワードを忘れてしまいましたか？
          <br />
          登録したメールアドレスを入力してください。
          <br />
          再設定用のメールをお送りします。
        </p>

        <form onSubmit={handleResetPassword} css={styles.form}>
          <label htmlFor="forgot-email" css={styles.label}>
            メールアドレス
          </label>

          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
            css={styles.input}
          />

          <button type="submit" disabled={loading} css={styles.submitButton}>
            {loading ? "送信中..." : "再設定メールを送信"}
          </button>
        </form>

        {message && <p css={styles.successMessage}>{message}</p>}

        {error && <p css={styles.errorMessage}>{error}</p>}

        <button
          type="button"
          onClick={() => navigate("/Login")}
          css={styles.backButton}
        >
          ← ログイン画面に戻る
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: css`
    min-height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    background: #f7f8fc;
    box-sizing: border-box;
  `,

  card: css`
    width: 100%;
    max-width: 440px;
    padding: 45px 40px;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(50, 60, 90, 0.08);
    text-align: center;
    box-sizing: border-box;

    @media (max-width: 480px) {
      padding: 35px 23px;
    }
  `,

  icon: css`
    font-size: 42px;
    margin-bottom: 15px;
  `,

  title: css`
    font-size: 25px;
    font-weight: 700;
    color: #333b50;
    margin: 0 0 18px;

    @media (max-width: 480px) {
      font-size: 22px;
    }
  `,

  description: css`
    font-size: 14px;
    line-height: 1.9;
    color: #777f91;
    margin-bottom: 30px;
  `,

  form: css`
    display: flex;
    flex-direction: column;
    text-align: left;
    gap: 12px;
  `,

  label: css`
    font-size: 14px;
    font-weight: 600;
    color: #4b5367;
  `,

  input: css`
    width: 100%;
    padding: 14px 15px;
    border: 1px solid #dce1eb;
    border-radius: 10px;
    font-size: 15px;
    outline: none;
    box-sizing: border-box;
    transition: 0.2s;

    &:focus {
      border-color: #8298d6;
      box-shadow: 0 0 0 3px rgba(130, 152, 214, 0.15);
    }
  `,

  submitButton: css`
    width: 100%;
    padding: 14px;
    margin-top: 10px;
    border: none;
    border-radius: 10px;
    background: #8298d6;
    color: #ffffff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;

    &:hover:not(:disabled) {
      background: #6d83c1;
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `,

  successMessage: css`
    margin-top: 20px;
    padding: 12px;
    border-radius: 8px;
    background: #edf7f0;
    color: #398052;
    font-size: 13px;
    line-height: 1.7;
  `,

  errorMessage: css`
    margin-top: 20px;
    padding: 12px;
    border-radius: 8px;
    background: #fff0f0;
    color: #d9534f;
    font-size: 13px;
    line-height: 1.7;
  `,

  backButton: css`
    margin-top: 25px;
    padding: 8px 12px;
    border: none;
    background: transparent;
    color: #7886a8;
    font-size: 14px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      color: #4e659f;
      text-decoration: underline;
    }
  `,
};
