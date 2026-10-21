import { css } from "@emotion/react";
import { useNavigate, useLocation } from "react-router-dom";

export const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav css={menuStyle}>
      {/* 設定 */}
      <button
        css={menuItemStyle}
        onClick={() => navigate("/settings")}
        type="button"
      >
        <span css={iconStyle}>⚙</span>
        <span css={labelStyle}>設定</span>
      </button>

      {/* 検索 */}
      <button
        css={[
          menuItemStyle,
          location.pathname === "/spot-list" && activeItemStyle,
        ]}
        onClick={() => navigate("/spot-list")}
        type="button"
      >
        <span css={iconStyle}>⌕</span>
        <span css={labelStyle}>検索</span>
      </button>

      {/* お気に入り */}
      <button
        css={[
          menuItemStyle,
          location.pathname === "/Favlist" && activeItemStyle,
        ]}
        onClick={() => navigate("/Favlist")}
        type="button"
      >
        <span css={iconStyle}>♡</span>
        <span css={labelStyle}>お気に入り</span>
      </button>

      {/* しおり */}
      <button
        css={menuItemStyle}
        onClick={() => navigate("/plan-list")}
        type="button"
      >
        <span css={iconStyle}>▣</span>
        <span css={labelStyle}>しおり</span>
      </button>
    </nav>
  );
};

/* ========================================
   メニュー全体
======================================== */

const menuStyle = css`
  position: fixed;
  bottom: 0;
  left: 50%;

  transform: translateX(-50%);

  width: 100%;
  max-width: 640px;
  height: 70px;

  display: flex;

  background-color: #ffffff;

  border-top: 1px solid #e5e5e5;

  z-index: 1000;
`;

/* ========================================
   メニュー項目
======================================== */

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

/* ========================================
   アイコン
======================================== */

const iconStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;

  font-size: 24px;
  line-height: 1;
`;

/* ========================================
   文字
======================================== */

const labelStyle = css`
  font-size: 10px;
  line-height: 1;

  color: #9dd8e3;
`;

/* ========================================
   現在のページ
======================================== */

const activeItemStyle = css`
  color: #ffb000;

  ${labelStyle} {
    color: #ffb000;
  }
`;
