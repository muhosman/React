import ProfilePage from "./pages/ProfilePage";

import LoginPage from "./pages/LoginPage/LoginPage.js";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import SiteLayout from "./components/Layout/SiteLayout";
import MainPage from "./pages/MainPage";
import Page404 from "./pages/Page404";
import ReportPage from "./pages/MainPage";
import WorkersPage from "./pages/WorkersPage";
import SettingsPage from "./pages/SettingsPage";
import DashBoardPage from "./pages/DashBoardPage";

const ROLES = {
  Firm: "firm",
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<LoginPage />} />
      </Route>

      <Route element={<RequireAuth allowedRoles={[ROLES.Firm]} />}>
        <Route path="" element={<SiteLayout />}>
          <Route element={<RequireAuth allowedRoles={[ROLES.Firm]} />}>
            <Route path="Anasayfa" element={<MainPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Firm]} />}>
            <Route path="Dashboard" element={<DashBoardPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Firm]} />}>
            <Route path="Profil" element={<ProfilePage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Firm]} />}>
            <Route path="Ayarlar" element={<SettingsPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Firm]} />}>
            <Route path="Çalışanlar" element={<WorkersPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Firm]} />}>
            <Route path="Raporlar" element={<ReportPage />} />
          </Route>
          <Route path="*" element={<Page404 />} />
        </Route>
      </Route>
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
