import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

//Icons
import { RiBillLine } from "react-icons/ri";
import { AiFillDelete } from "react-icons/ai";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { GoDeviceMobile } from "react-icons/go";
import { HiOutlinePencilAlt, HiOutlineUserGroup } from "react-icons/hi";

function EditFirmPage() {
  //HEADER
  const PageHeaderIcon = "mr-4 xl:w-8 xl:h-8 md:w-7 md:h-7 w-6 h-6";
  const PageHeaderExitIcon = "xl:w-8 xl:h-8 md:w-7 md:h-7 w-6 h-6";
  const PageHeader =
    " max-md:hidden font-SemiBold xl:text-2xl md:text-XL text-BASE tracking-wider";

  const [Info, setInfo] = useState();

  const TopClick = function (PageNumber) {
    setInfo(PageNumber);
  };

  const TopInformation = function () {
    return (
      <div className="absolute top-0 bg-fourth z-50 w-full h-fit flex justify-between">
        <div className="flex overflow-y-scroll no-scrollbar">
          <NavLink
            to="Bilgi"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "white", color: "black" } : {}
            }
            className={`flex px-6 py-3 z-20 transition-all duration-500  
            hover:bg-white text-white hover:text-fourth gap-4`}
          >
            <div className="flex justify-center items-center pt-2">
              <HiOutlinePencilAlt className={`${PageHeaderIcon}`} />
              <p className={`${PageHeader}`}>Firma Düzenleme</p>
            </div>
          </NavLink>
          <NavLink
            to="Fatura"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "white", color: "black" } : {}
            }
            className={`flex px-6 py-3 z-20 transition-all duration-500  
            hover:bg-white text-white hover:text-fourth gap-4`}
          >
            <div className="flex justify-center items-center pt-2">
              <RiBillLine className={`${PageHeaderIcon}`} />
              <p className={`${PageHeader}`}>Faturalar</p>
            </div>
          </NavLink>
          <NavLink
            to="Firmalar"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "white", color: "black" } : {}
            }
            className={`flex px-6 py-3 z-20 transition-all duration-500  
            hover:bg-white text-white hover:text-fourth gap-4`}
          >
            <div className="flex justify-center items-center pt-2">
              <SiHomeassistantcommunitystore className={`${PageHeaderIcon}`} />
              <p className={`${PageHeader}`}>Alt Firmalar</p>
            </div>
          </NavLink>
          <NavLink
            to="Kullanıcılar"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "white", color: "black" } : {}
            }
            className={`flex px-6 py-3 z-20 transition-all duration-500  
            hover:bg-white text-white hover:text-fourth gap-4`}
          >
            <div className="flex justify-center items-center pt-2">
              <HiOutlineUserGroup className={`${PageHeaderIcon}`} />
              <p className={`${PageHeader}`}>Kullanıcılar</p>
            </div>
          </NavLink>
          <NavLink
            to="Cihazlar"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "white", color: "black" } : {}
            }
            className={`flex px-6 py-3 z-20 transition-all duration-500  
            hover:bg-white text-white hover:text-fourth gap-4`}
          >
            <div className="flex justify-center items-center pt-2">
              <GoDeviceMobile className={`${PageHeaderIcon}`} />
              <p className={`${PageHeader}`}>Cihazlar</p>
            </div>
          </NavLink>
          <NavLink
            to="Sil"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "white", color: "black" } : {}
            }
            className={`flex px-6 py-3 z-20 transition-all duration-500  
            hover:bg-white text-white hover:text-fourth gap-4`}
          >
            <div className="flex justify-center items-center pt-2">
              <AiFillDelete className={`${PageHeaderIcon}`} />
              <p className={`${PageHeader}`}>Firmayı Sil</p>
            </div>
          </NavLink>
        </div>
        <NavLink to="/Anasayfa/Firma">
          <button
            className={`flex px-8 py-2 transition-all duration-200  text-white
       h-14 z-10 justify-center items-center
      hover:text-fifth w-fit `}
          >
            <MdOutlineKeyboardBackspace className={`${PageHeaderExitIcon}`} />
          </button>
        </NavLink>
      </div>
    );
  };
  return (
    <div className="fixed w-screen  h-screen top-0 left-0 z-40 bg-background lg:text-BASE">
      {/* Device Top Information Close Button */}
      <TopInformation />

      {/* Device Type And Firm name */}
      <div
        className={`flex flex-col bg-background w-full h-screen md:px-16 px-6
          overflow-y-scroll no-scrollbar`}
      >
        {/* Device Important Info. */}
        <div
          className={`flex
          mt-[8rem] mb-20 flex-col justify-between gap-4 rounded-xl text-black`}
        >
          <Outlet />
        </div>
      </div>
      <div className="fixed bottom-0  z-50">
        <div
          style={{ height: "40px" }}
          className="w-screen  bg-fourth flex justify-center items-center"
        ></div>
      </div>
    </div>
  );
}

export default EditFirmPage;
