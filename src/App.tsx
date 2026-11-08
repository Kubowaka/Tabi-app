import "./App.css";

import { Login } from "./pages/LoginPage/Login";
import { SpotList } from "./pages/Spot&FavListPage/SpotList";
import { FavList } from "./pages/Spot&FavListPage/FavList";
import { GuidebookList } from "./pages/GuidebookListPage/GuidebookList";
import { PlanPage } from "./pages/PlanPage/PlanPage";
import { CreateSchedule } from "./pages/CreateSchedulePage/CreateSchedulePage";
import { MainLayout } from "./layouts/MainLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import { SharedPlan } from "./pages/SharedPlanPages/SharedPlan";
import { CreateAccount } from "./pages/LoginPage/components/CreateAccount";
import { ForgotPassword } from "./pages/LoginPage/components/ForgotPassword";

function App() {
  return (
    <Routes>
      {/* 最初に開いたらしおり一覧へ */}
      <Route path="/" element={<Navigate to="/plan-list" replace />} />

      {/* 共通レイアウト（ログイン不要） */}
      <Route element={<MainLayout />}>
        {/* ログイン */}
        <Route path="/Login" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/*アカウント登録*/}
        <Route path="/create-account" element={<CreateAccount />} />

        {/* パスワードリセット */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 観光地リスト */}
        <Route path="/spot-list" element={<SpotList />} />

        {/* お気に入り */}
        <Route path="/Favlist" element={<FavList />} />

        {/* しおり一覧 */}
        <Route path="/plan-list" element={<GuidebookList />} />

        {/* しおり作成・編集 */}
        <Route path="/plan-make" element={<PlanPage />} />

        {/* 予定追加 */}
        <Route path="/add-plan-schedule" element={<CreateSchedule />} />
      </Route>

      {/* 共有されたしおり */}
      <Route path="/shared/:token" element={<SharedPlan />} />
    </Routes>
  );
}

export default App;
