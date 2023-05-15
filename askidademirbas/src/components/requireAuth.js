import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  console.log(allowedRoles);
  return allowedRoles?.includes(auth?.role) && auth?.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/YetkisizGiris" state={{ from: location }} replace={false} />
  );
};

export default RequireAuth;
