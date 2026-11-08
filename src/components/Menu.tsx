import { css } from "@emotion/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const auth = getAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Firebaseのログイン状態を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, [auth]);


  // ログアウト処理
  const handleLogout = async () => {
    const confirmed = window.confirm("ログアウトしますか？");

    if (!confirmed) return;

    try {
      await signOut(auth);
      navigate("/Login", { replace: true });
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
      alert("ログアウトに失敗しました。もう一度お試しください。");
    }
  };


  // ログイン処理
  const handleLogin = () => {
    navigate("/Login");
  };

  const isActive = (path: string) => {
    if (path === "/plan-list") {
      return (
        location.pathname === "/plan-list" || location.pathname === "/plan-make"
      );
    }

    return location.pathname === path;
  };
  return (
    <nav css={menuStyle}>

      {/* ログイン・ログアウト */}
      <button
        css={menuItemStyle}
        onClick={isLoggedIn ? handleLogout : handleLogin}
        type="button"
      >
        <span css={iconStyle}>
          {isLoggedIn ? (

            // ログアウトアイコン
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            </svg>
          ) : (
            
            // ログインアイコン
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" x2="3" y1="12" y2="12" />
            </svg>
          )}
        </span>

        <span css={labelStyle}>{isLoggedIn ? "ログアウト" : "ログイン"}</span>
      </button>

      {/* 検索 */}
      <button
        css={[menuItemStyle, isActive("/spot-list") && activeItemStyle]}
        onClick={() => navigate("/spot-list")}
        type="button"
      >
        <span css={iconStyle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-search preview-icon"
          >
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
        </span>
        <span css={labelStyle}>検索</span>
      </button>

      {/* お気に入り */}
      <button
        css={[menuItemStyle, isActive("/Favlist") && activeItemStyle]}
        onClick={() => navigate("/Favlist")}
        type="button"
      >
        <span css={iconStyle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-star preview-icon"
          >
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
          </svg>
        </span>
        <span css={labelStyle}>お気に入り</span>
      </button>

      {/* しおり */}
      <button
        css={[menuItemStyle, isActive("/plan-list") && activeItemStyle]}
        onClick={() => navigate("/plan-list")}
        type="button"
      >
        <span css={iconStyle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-notebook-tabs preview-icon"
          >
            <path d="M2 6h4" />
            <path d="M2 10h4" />
            <path d="M2 14h4" />
            <path d="M2 18h4" />
            <rect width="16" height="20" x="4" y="2" rx="2" />
            <path d="M15 2v20" />
            <path d="M15 7h5" />
            <path d="M15 12h5" />
            <path d="M15 17h5" />
          </svg>
        </span>
        <span css={labelStyle}>しおり</span>
      </button>
    </nav>
  );
};

const menuStyle = css`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  /* max-width: 1023px; */
  height: 70px;
  display: flex;
  background-color: #ffffff;
  border-top: 1px solid #e5e5e5;
  z-index: 1000;

  /* PC版だけ左側の縦メニューにする */
  @media (min-width: 1024px) {
    /* top: 24px; */
    top: 0;
    bottom: 28px;
    left: 28px;
    transform: none;
    width: 60px;
    max-width: none;
    height: auto;
    flex-direction: column;
    border-top: none;
    border: 1px solid #e5e5e5;
    border-radius: 14px 0 0 14px;
  }
`;

const menuItemStyle = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border: none;
  background: transparent;
  color: #9dd8e3;
  cursor: pointer;
  padding: 5px 0;

  &:hover {
    opacity: 0.8;
  }
`;

const iconStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 24px;
  line-height: 1;
`;

const labelStyle = css`
  font-size: 10px;
  line-height: 1;
  color: inherit;
`;

const activeItemStyle = css`
  color: #ffb000;
  font-weight: bold;
`;
