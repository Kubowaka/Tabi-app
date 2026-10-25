import "./App.css";

import { Login } from "./pages/LoginPage/Login";
import { SpotList } from "./pages/Spot&FavListPage/SpotList";
import { FavList } from "./pages/Spot&FavListPage/FavList";
import { PlanList } from "./pages/PlanListPage/PlanList";
import { PlanMake } from "./pages/PlanMakePage/PlanMake";
import { AddPlanSchedule } from "./pages/AddPlanSchedulePage/AddPlanSchedule";
import { MainLayout } from "./layouts/MainLayout";

import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* 最初に開いたらログインページへ */}
      <Route path="/" element={<Navigate to="/Login" replace />} />

      {/* ログイン */}
      <Route path="/Login" element={<Login />} />

      {/* ログイン後の共通レイアウト */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* 観光地リスト */}
        <Route path="/spot-list" element={<SpotList />} />

        {/* お気に入り */}
        <Route path="/Favlist" element={<FavList />} />

        {/* しおり一覧 */}
        <Route path="/plan-list" element={<PlanList />} />

        {/* しおり作成・編集 */}
        <Route path="/plan-make" element={<PlanMake />} />

        {/* 予定追加 */}
        <Route path="/add-plan-schedule" element={<AddPlanSchedule />} />
      </Route>
    </Routes>
  );
}

export default App;
