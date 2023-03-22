import ProfilePage from "./pages/ProfilePage";

import LoginPage from "./pages/LoginPage/LoginPage.js";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import SiteLayout from "./components/Layout/SiteLayout";

import Page404 from "./pages/Page404";

const ROLES = {
  Management: "management",
  Admin: "admin",
  Accounting: "accounting",
  Manufacture: "manufacture",
  Playmaker: "playmaker",
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<LoginPage />} />
      </Route>

      <Route
        element={
          <RequireAuth
            allowedRoles={[
              ROLES.Admin,
              ROLES.Management,
              ROLES.Accounting,
              ROLES.Manufacture,
              ROLES.Playmaker,
            ]}
          />
        }
      >
        <Route path="Anasayfa" element={<SiteLayout />}>
          <Route
            element={
              <RequireAuth
                allowedRoles={[
                  ROLES.Admin,
                  ROLES.Management,
                  ROLES.Accounting,
                  ROLES.Manufacture,
                  ROLES.Playmaker,
                ]}
              />
            }
          >
            <Route path="Profil" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Page404 />} />
        </Route>
      </Route>
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
