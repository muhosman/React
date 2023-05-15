import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { RiAddFill } from "react-icons/ri";
import { AiOutlineFlag } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { HiOutlineHome } from "react-icons/hi";
import imager from "../assets/gtubeng_logo-removebg-preview.png";

export default function Menu() {
  const navIcon = "w-8 h-8";
  const navText = " text-[16px]";
  const navButton =
    "flex mt-4 pb-2 items-center gap-2 border-b-4 border-transparent hover:border-white transition border-bottom-color 0.2s ease-in-out";
  const [isHover, setIsHover] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { auth } = useAuth();

  const links = [
    {
      label: "Anasayfa",
      path: "/Anasayfa",
      roles: ["admin", "user"],
    },
    {
      label: "Profil",
      path: "/Profil",
      roles: ["admin", "user"],
    },
  ];

  return (
    <div className=" fixed w-screen h-[6rem] top-0 left-0 bg-main z-50 ">
      <div className=" flex items-center justify-between h-full mx-[18rem]">
        <div
          id="logo"
          className="flex items-center rounded-md bg-secondary text-white w-fit px-4 py-2 tracking-[2px]"
        >
          <img className=" w-12 h-12" src={imager} alt="product" />
          askıdademirbaş.com
        </div>

        <div className=" flex items-center gap-8 text-white">
          <button className={navButton}>
            <HiOutlineHome className={navIcon} />
            <p className={navText}>Anasayfa</p>
          </button>
          <button className={navButton}>
            <CgProfile className={navIcon} />
            <p className={navText}>Osman Talha Aydın</p>
          </button>

          <button className={navButton}>
            <AiOutlineFlag className={navIcon} />
            <p className={navText}>Favorilerim</p>
          </button>

          <button className=" flex items-center gap-2 rounded-md tracking-widest px-4 py-2 bg-fifth text-white hover:opacity-80 active:scale-75 transition-all duration-300  ">
            <RiAddFill className={navIcon} />{" "}
            <p className={navText}>İlan Ver</p>
          </button>
        </div>
      </div>
    </div>
  );
}
