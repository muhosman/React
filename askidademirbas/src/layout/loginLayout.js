import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Outlet } from "react-router-dom";

export default function LoginLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  return (
    <div className="bg-fourth w-screen h-screen">
      <Outlet />
    </div>
  );
}
