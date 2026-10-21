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
      <h1 css={titleStyle}>
        {title}
      </h1>
    </header>
  );
};

/* ========================================
   ヘッダー
======================================== */

const headerStyle = css`
  width: 100%;
  height: 54px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #9dd8e3;
`;

const titleStyle = css`
  margin: 0;

  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
`;