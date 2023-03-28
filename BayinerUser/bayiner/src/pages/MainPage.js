import { CiHome } from "react-icons/ci";
import { GoGraph } from "react-icons/go";
import { BsPerson } from "react-icons/bs";
import { RiSettings3Fill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { BiLogOut } from "react-icons/bi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import avatar from "../img/avatar.png";
import useAuth from "../hooks/useAuth";
import useUsersContext from "../hooks/use-user-context";

export default function MainPage() {
  const { auth, setAuth } = useAuth();
  const { LogOut } = useUsersContext();

  const icon = "w-[6rem] h-[6rem]";
  const iconText = " font-Bold text-center text-2xl";
  const iconCard = "p-4 rounded-md active:scale-90 transition-all duration-400";

  const handleLogout = async () => {
    try {
      const token = auth.accessToken;
      localStorage.clear();
      setAuth(null);
      await LogOut(token);
    } catch (err) {}
  };
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className=" flex items-center justify-center p-4 shadow-xl shadow-slate-400 sm:hidden  rounded-full ">
        <div className="w-fit text-white transition-all duration-300">
          <img src={avatar} alt="Profile" className="max-w-[10rem]" />
        </div>
      </div>
      <div className=" grid grid-cols-2 gap-10 mt-8 justify-center">
        <div className={`${iconCard} bg-purple-600 text-white shadow-lg`}>
          <GoGraph className={icon} />
          <p className={iconText}>Dashboard</p>
        </div>
        <div className={`${iconCard} bg-red-400 text-white shadow-lg`}>
          <BsPerson className={icon} />
          <p className={iconText}>Çalışanlar</p>
        </div>
        <div className={`${iconCard} bg-green-400 text-white shadow-lg`}>
          <RiSettings3Fill className={icon} />
          <p className={iconText}>Ayarlar</p>
        </div>
        <div className={`${iconCard} bg-blue-600 text-white shadow-lg`}>
          <HiOutlineDocumentReport className={icon} />
          <p className={iconText}>Raporlar</p>
        </div>

        <div
          onClick={() => {
            handleLogout();
          }}
          className={`${iconCard} bg-gray-600 text-white shadow-lg`}
        >
          <BiLogOut className={icon} />
          <p className={iconText}>Çıkış</p>
        </div>
      </div>
    </div>
  );
}
