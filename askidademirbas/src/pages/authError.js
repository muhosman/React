import { useLocation, useNavigate } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";

export default function AuthError() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className=" fixed top-[22rem] left-1/2 -translate-y-1/2 -translate-x-1/2">
      <div className=" text-[30rem] font-extrabold text-third">401</div>
      <div className=" text-center"></div>
      <div
        className=" text-center flex items-center justify-center gap-2 text-[2rem] hover:text-third cursor-pointer transition-all duration-300"
        onClick={() => {
          navigate("/", {
            state: { from: location },
            replace: false,
          });
        }}
      >
        Yetki hatası, giriş sayfasına gidin <FaLongArrowAltRight />
      </div>
    </div>
  );
}
