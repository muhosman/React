import { NavLink } from "react-router-dom";
import { BiLogOut, BiErrorAlt } from "react-icons/bi";
import { IoMdPerson } from "react-icons/io";

import { AiFillSetting } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { AiOutlineHome } from "react-icons/ai";

import { GoGraph } from "react-icons/go";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { HiOutlineDocumentReport } from "react-icons/hi";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import Sidebarlink from "./Sidebarlink";

function Sidebar() {
  const profileInfo = " xl:text-2xl lg:text-xl md:text-BASE ";
  const profileImg = "w-6 h-6";
  const styleLinkIcon = "xl:w-8 xl:h-8 lg:w-6 lg:h-6 w-4 h-4";
  const linkInfo = " 2xl:text-2xl xl:text-xl lg:text-BASE md:text-BASE";

  const [isHover, setIsHover] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { auth } = useAuth();

  const links = [
    {
      icon: <AiOutlineHome className={styleLinkIcon} />,
      label: "Anasayfa",
      path: "/",
      roles: ["admin", "management", "manufacture", "accounting"],
    },
    {
      icon: <GoGraph className={styleLinkIcon} />,
      label: "Dashboard",
      path: "/",
      roles: ["admin", "management", "manufacture", "accounting"],
    },
    {
      icon: <IoMdPerson className={styleLinkIcon} />,
      label: "Çalışanlar",
      path: "/",
      roles: ["admin", "management", "manufacture", "accounting"],
    },
    {
      icon: <AiFillSetting className={styleLinkIcon} />,
      label: "Ayarlar",
      path: "/",
      roles: ["admin", "management", "manufacture", "accounting"],
    },
    {
      icon: <HiOutlineDocumentReport className={styleLinkIcon} />,
      label: "Raporlar",
      path: "/",
      roles: ["admin", "management", "manufacture", "accounting"],
    },
  ];

  return (
    <>
      <div className="md:top-0 md:left-0 md:fixed z-40 md:flex hidden">
        <div
          id="sideBar"
          className=" transition-all duration-500 transform w-screen h-fit border-fourth text-white bg-fourth shadow-xl "
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <div className="flex px-4 gap-3 h-fit py-2 pt-4 justify-between w-screen">
            <div className="relative overflow-y-scroll no-scrollbar flex  gap-4">
              {links.map((link, index) => (
                <Sidebarlink
                  key={index}
                  link={link}
                  isHover={isHover}
                  roles={link.roles}
                  linkInfo={linkInfo}
                />
              ))}
            </div>
            <div className=" flex flex-row gap-4 justify-end items-center w-fit ">
              <NavLink to={"/Anasayfa/Profil"}>
                <div className="w-fit rounded-md border-b-2 border-transparent hover:border-white p-2 active:border-0 hover:text-input transition-all duration-300">
                  <CgProfile className={styleLinkIcon} />{" "}
                </div>
              </NavLink>
              <NavLink to={"/"}>
                <div className="w-fit rounded-md border-b-2 border-transparent hover:border-white p-2 active:border-0 hover:text-input transition-all duration-300">
                  <BiLogOut className={styleLinkIcon} />{" "}
                </div>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
