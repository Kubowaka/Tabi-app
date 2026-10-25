import { css } from "@emotion/react";
import { useNavigate, useLocation } from "react-router-dom";

export const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
      {/* 設定 */}
      <button
        css={[menuItemStyle, isActive("/settings") && activeItemStyle]}
        onClick={() => alert("このページは現在使えません。")}
        type="button"
      >
        <span css={iconStyle}>⚙</span>
        <span css={labelStyle}>設定</span>
      </button>

      {/* 検索 */}
      <button
        css={[menuItemStyle, isActive("/spot-list") && activeItemStyle]}
        onClick={() => navigate("/spot-list")}
        type="button"
      >
        <span css={iconStyle}>⌕</span>
        <span css={labelStyle}>検索</span>
      </button>

      {/* お気に入り */}
      <button
        css={[menuItemStyle, isActive("/Favlist") && activeItemStyle]}
        onClick={() => navigate("/Favlist")}
        type="button"
      >
        <span css={iconStyle}>★</span>
        <span css={labelStyle}>お気に入り</span>
      </button>

      {/* しおり */}
      <button
        css={[menuItemStyle, isActive("/plan-list") && activeItemStyle]}
        onClick={() => navigate("/plan-list")}
        type="button"
      >
        <span css={iconStyle}>□</span>
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
