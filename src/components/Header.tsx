import { css } from "@emotion/react";
import { useLocation } from "react-router-dom";

export const Header = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/spot-list":
        return "観光地リスト";

      case "/Favlist":
        return "お気に入り";

      case "/plan-list":
        return "旅のしおり";

      case "/plan-make":
        return "旅のしおり";

      default:
        return "";
    }
  };

  const title = getTitle();

  // タイトルがないページでは表示しない
  if (!title) {
    return null;
  }

  return (
    <header css={headerStyle}>
      <h1 css={titleStyle}>{title}</h1>
    </header>
  );
};

/* ========================================
   ヘッダー
======================================== */

// const headerStyle = css`
//   position: fixed;
//   top: 0;
//   z-index: 100;

//   width: 100%;
//   height: 54px;
//   box-sizing: border-box;
//   flex-shrink: 0;

//   display: flex;
//   align-items: center;
//   justify-content: center;

//   background-color: #9dd8e3;
// `;

const headerStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  width: 100%;
  height: 54px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #9dd8e3;

  /* PC版だけ左メニューの右側から表示 */
  @media (min-width: 1024px) {
    left: 90px;
    width: calc(100% - 90px);
  }
`;

const titleStyle = css`
  margin: 0;

  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
`;
