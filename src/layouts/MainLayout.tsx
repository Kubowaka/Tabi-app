import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Menu } from "../components/Menu";

export const MainLayout = () => {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <Menu />
    </>
  );
};