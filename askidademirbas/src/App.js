import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import RequireAuth from "./components/requireAuth";
import MainLayout from "./layout/mainLayout";
import Main from "./pages/main";
import AuthError from "./pages/authError";
import LoginLayout from "./layout/loginLayout";

const ROLES = {
  Admin: "admin",
  User: "user",
};

function App() {
  return (
    <Routes>
      <Route element={<LoginLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/YetkisizGiris" element={<AuthError />} />
      </Route>

      <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.User]} />}>
        <Route path="/" element={<MainLayout />}>
          <Route
            element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.User]} />}
          >
            <Route path="Anasayfa" element={<Main />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
