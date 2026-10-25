import { css } from "@emotion/react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Menu } from "../components/Menu";

export const MainLayout = () => {
  return (
    <>
      <Header />
      <main css={mainStyle}>
        <Outlet />
      </main>

      <Menu />
    </>
  );
};

const mainStyle = css`
  padding-top: 54px;
  box-sizing: border-box;

  /* PC表示だけ左右に余白をつける */
  @media (min-width: 1024px) {
    margin-left: 100px;
    margin-right: 44px;
  }
`;
