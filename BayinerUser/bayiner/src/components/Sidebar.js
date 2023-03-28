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
import { useState } from "react";
import Sidebarlink from "./Sidebarlink";

function Sidebar() {
  const styleLinkIcon = "xl:w-8 xl:h-8 lg:w-6 lg:h-6 w-4 h-4";
  const linkInfo = " 2xl:text-2xl xl:text-xl lg:text-BASE md:text-BASE";

  const [isHover, setIsHover] = useState(false);

  const links = [
    {
      icon: <GoGraph className={styleLinkIcon} />,
      label: "Dashboard",
      path: "/Dashboard",
      roles: ["firm"],
    },
    {
      icon: <IoMdPerson className={styleLinkIcon} />,
      label: "Çalışanlar",
      path: "/Çalışanlar",
      roles: ["firm"],
    },
    {
      icon: <AiFillSetting className={styleLinkIcon} />,
      label: "Ayarlar",
      path: "/Ayarlar",
      roles: ["firm"],
    },
    {
      icon: <HiOutlineDocumentReport className={styleLinkIcon} />,
      label: "Raporlar",
      path: "/Raporlar",
      roles: ["firm"],
    },
  ];

  return (
    <>
      <div className="md:top-0 md:left-0 md:fixed z-40 md:flex hidden">
        <div
          id="sideBar"
          className=" w-screen h-fit border-fourth text-white bg-fourth shadow-xl "
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
              <NavLink to={"/Profil"}>
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
