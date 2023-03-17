import { NavLink } from "react-router-dom";
import { BiLogOut, BiErrorAlt } from "react-icons/bi";
import { SiBandsintown } from "react-icons/si";

import { BsGraphUp, BsCart2 } from "react-icons/bs";
import { MdAddBusiness } from "react-icons/md";
import { GiPositionMarker, GiModernCity, GiCoffeePot } from "react-icons/gi";
import { FiType } from "react-icons/fi";
import LogoImage from "./../img/logo2.png";

import {
  MdCoffeeMaker,
  MdProductionQuantityLimits,
  MdChecklistRtl,
} from "react-icons/md";
import {
  TbTruckDelivery,
  TbReportSearch,
  TbError404,
  TbReportMoney,
} from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { RiSettings3Line } from "react-icons/ri";
import { HiOutlineDesktopComputer, HiOutlineMenu } from "react-icons/hi";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { FiUsers } from "react-icons/fi";
import avatar from "../img/Profile2.png";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import Sidebarlink from "./Sidebarlink";

function Sidebar() {
  const profileInfo = " xl:text-2xl lg:text-xl md:text-BASE ";
  const profileImg = "w-14 h-14";
  const styleLinkIcon = "lg:w-5 lg:h-5 w-4 h-4";
  const linkInfo = " 2xl:text-2xl xl:text-xl lg:text-BASE md:text-BASE";

  const [isHover, setIsHover] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { auth } = useAuth();

  const links = [
    {
      icon: <BsGraphUp className={styleLinkIcon} />,
      label: "Dashboard",
      path: "/Anasayfa/Dashboard",
      roles: ["admin", "management"],
    },
    {
      icon: <BiErrorAlt className={styleLinkIcon} />,
      label: "Arıza | Hata",
      path: "/Anasayfa/FaultError",
      roles: ["admin", "management"],
    },
    {
      icon: <MdAddBusiness className={styleLinkIcon} />,
      label: "Firmalar",
      path: "/Anasayfa/Firma",
      roles: ["admin", "management"],
    },
    {
      icon: <MdCoffeeMaker className={styleLinkIcon} />,
      label: "Cihazlar",
      path: "/Anasayfa/Cihaz",
      roles: ["admin", "management"],
    },
    {
      icon: <BsCart2 className={styleLinkIcon} />,
      label: "Siparişler",
      path: "/Anasayfa/Sipariş",
      roles: [],
    },
    {
      icon: <TbTruckDelivery className={styleLinkIcon} />,
      label: "Teslimat",
      path: "/Anasayfa/Teslimat",
      roles: [],
    },
    {
      icon: <MdChecklistRtl className={styleLinkIcon} />,
      label: "Stoklar",
      path: "/Anasayfa/Stok",
      roles: ["admin", "management"],
    },
    {
      icon: <TbReportMoney className={styleLinkIcon} />,
      label: "Faturalar",
      path: "/Anasayfa/Fatura",
      roles: ["admin", "management"],
    },
    {
      icon: <FiUsers className={styleLinkIcon} />,
      label: "Kullanıcılar",
      path: "/Anasayfa/Kullanıcı",
      roles: ["admin", "management"],
    },
    {
      icon: <TbReportSearch className={styleLinkIcon} />,
      label: "Raporlar",
      path: "/Anasayfa/Rapor",
      roles: ["admin", "management"],
    },
    {
      icon: <HiOutlineDesktopComputer className={styleLinkIcon} />,
      label: "Parametreler",
      roles: ["admin"],
      childrens: [
        {
          label: "Cihaz Tipleri",
          icon: <GiCoffeePot className={styleLinkIcon} />,
          path: "/Anasayfa/CihazTipi",
          roles: ["admin"],
        },
        {
          label: "Cihaz Ayarları",
          icon: <RiSettings3Line className={styleLinkIcon} />,
          path: "/Anasayfa/CihazAyarı",
          roles: ["admin"],
        },
        {
          label: "Cihaz Arıza Tipleri",
          icon: <TbError404 className={styleLinkIcon} />,
          path: "/Anasayfa/CihazServis",
          roles: ["admin"],
        },
        {
          label: "Cihaz Durumu",
          icon: <GiPositionMarker className={styleLinkIcon} />,
          path: "/Anasayfa/CihazDurumu",
          roles: ["admin"],
        },

        {
          label: "Ürün Bilgisi",
          icon: <MdProductionQuantityLimits className={styleLinkIcon} />,
          path: "/Anasayfa/CihazBilgisi",
          roles: ["admin"],
        },
        {
          label: "Ürün Tipi",
          icon: <FiType className={styleLinkIcon} />,
          path: "/Anasayfa/ÜrünTipi",
          roles: ["admin"],
        },
        {
          label: "Şehir",
          icon: <GiModernCity className={styleLinkIcon} />,
          path: "/Anasayfa/Şehir",
          roles: ["admin"],
        },
        {
          label: "İlçe",
          icon: <SiBandsintown className={styleLinkIcon} />,
          path: "/Anasayfa/İlçe",
          roles: ["admin"],
        },
        {
          label: "Rapor Tipleri",
          icon: <TbReportSearch className={styleLinkIcon} />,
          path: "/Anasayfa/RaporTipi",
          roles: [],
        },
      ],
    },
    {
      icon: <BiLogOut className={styleLinkIcon} />,
      label: "Logout",
      path: "/",
      roles: ["admin", "management"],
    },
  ];
  const OpenMenu = () => {
    return (
      <>
        <div
          onClick={() => setOpenMenu(false)}
          className="fixed inset-0 z-20 bg-gray-300 opacity-80 md:hidden"
        ></div>

        <div
          className="fixed flex w-fit h-[32rem] top-1/2 left-1/2 z-30 -translate-y-1/2 md:hidden
  -translate-x-1/2  "
        >
          <button
            onClick={() => setOpenMenu(false)}
            className=" fixed top-2 right-2 z-40"
          >
            <RxCross2 className=" text-white w-8 h-8 active:text-red-300 active:rounded-full" />
          </button>
          <div
            className=" bg-fourth flex flex-col 
  rounded-xl items-center w-[20rem] h-[24rem]  px-12 pt-24 pb-10 text-white"
          >
            <div className="  fixed top-3">
              <NavLink to={"/Anasayfa/profile"}>
                <div className=" border-2 border-white rounded-full hover:scale-110 transition-all duration-300">
                  <img src={avatar} alt="Profile" className={`${profileImg}`} />
                </div>
              </NavLink>
            </div>

            <div
              className=" bg-fourth flex flex-col h-[24rem] overflow-y-scroll no-scrollbar
  rounded-xl items-center w-[20rem]  px-12  text-white"
            >
              {links.map((link, index) => (
                <Sidebarlink
                  key={index}
                  link={link}
                  isHover={isHover}
                  roles={link.roles}
                />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <div className="md:hidden bg-fourth w-full left-0 top-0 z-20 fixed">
        <button onClick={() => setOpenMenu(true)} className="text-center p-3 ">
          <HiOutlineMenu className="w-10 h-10 self-center  text-white hover:rounded-xl hover:bg-white hover:text-fourth " />
        </button>
      </div>

      {openMenu && <OpenMenu />}
      <div className="md:top-0 md:left-0 md:fixed z-40 md:flex hidden">
        <div
          id="sideBar"
          className=" transition-all duration-500  transform 
  h-screen w-fit  xl:border-none border-b-4 border-fourth text-white bg-fourth shadow-xl "
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <div className="flex flex-col items-start px-4 gap-3 h-screen w-fit">
            <div className=" fixed">
              <div className=" flex flex-row justify-center items-center w-fit py-4 border-b-2">
                <NavLink to={"/Anasayfa/profile"}>
                  <div className="w-fit border-4 border-white rounded-full hover:scale-110 transition-all duration-300">
                    <img
                      src={avatar}
                      alt="Profile"
                      className={`${profileImg}`}
                    />
                  </div>
                </NavLink>

                <div className="flex flex-col justify-around">
                  <div className="">
                    <p
                      className={`${profileInfo}   ${
                        isHover ? "flex  px-4" : "hidden"
                      }`}
                    >
                      {auth?.name}
                    </p>
                    <p
                      className={`${profileInfo}    ${
                        isHover ? "flex  px-4" : "hidden"
                      }`}
                    >
                      {auth?.lastName}
                    </p>
                  </div>
                  <div>
                    <p
                      id="hidden"
                      className={`${profileInfo}   ${
                        isHover ? "flex  px-4" : "hidden"
                      }`}
                    >
                      {auth?.firmName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative mt-32 mb-20 overflow-y-scroll no-scrollbar flex flex-col  gap-4">
              {links.map((link, index) => (
                <Sidebarlink
                  key={index}
                  link={link}
                  isHover={isHover}
                  roles={link.roles}
                  linkInfo={linkInfo}
                />
              ))}
              <div
                className={`${
                  isHover
                    ? "self-center xl:w-[8rem] fixed bottom-0"
                    : "w-[6rem] fixed bottom-0 self-center"
                } `}
              >
                <img src={LogoImage} title="logo" alt="logo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
