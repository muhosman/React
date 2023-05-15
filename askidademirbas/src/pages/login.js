import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  return (
    <div className=" flex items-center justify-center w-screen h-screen ">
      <div className=" flex flex-col items-center">
        <div className=" text-[64px] ">Askıda Demirbaş</div>
        <button
          onClick={() => {
            setAuth({ role: "user", accessToken: "adgdsagdsaacxv3q32gdsa" });
            navigate("/Anasayfa", {
              state: { from: location },
              replace: false,
            });
          }}
          class=" transition-all duration-300 active:scale-90 bg-gradient-to-r text-white font-bold tracking-[4px] text-4xl rounded-full shadow-md bg-main p-10 hover:from-third hover:to-secondary "
        >
          Giriş
        </button>
      </div>
    </div>
  );
}
