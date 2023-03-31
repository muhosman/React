import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

//Icons
import { FiSettings } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { ImBoxAdd } from "react-icons/im";
import { HiOutlinePencilAlt } from "react-icons/hi";
import styles from "../../CustomStyles";
function EditDevicePage() {
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
              <HiOutlinePencilAlt className={`${styles.PageHeaderIcon}`} />
              <p className={`${styles.PageHeader}`}>Cihaz Düzenle</p>
            </div>
          </NavLink>
          <NavLink
            to="Ayar"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "white", color: "black" } : {}
            }
            className={`flex px-6 py-3 z-20 transition-all duration-500  
            hover:bg-white text-white hover:text-fourth gap-4`}
          >
            <div className="flex justify-center items-center pt-2">
              <FiSettings className={`${styles.PageHeaderIcon}`} />
              <p className={`${styles.PageHeader}`}>Ayarlar</p>
            </div>
          </NavLink>
          <NavLink
            to="Kota"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "white", color: "black" } : {}
            }
            className={`flex px-6 py-3 z-20 transition-all duration-500  
            hover:bg-white text-white hover:text-fourth gap-4`}
          >
            <div className="flex justify-center items-center pt-2">
              <ImBoxAdd className={`${styles.PageHeaderIcon}`} />
              <p className={`${styles.PageHeader}`}>Elle Kota Yükleme</p>
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
              <AiFillDelete className={`${styles.PageHeaderIcon}`} />
              <p className={`${styles.PageHeader}`}>Cihazı Sil</p>
            </div>
          </NavLink>
        </div>
        <NavLink
          to="/Anasayfa/Cihaz"
          className={`flex px-8 py-2 transition-all duration-200  text-white
       h-14 z-10 justify-center items-center
      hover:text-fifth w-fit `}
        >
          <MdOutlineKeyboardBackspace
            className={`${styles.PageHeaderExitIcon}`}
          />
        </NavLink>
      </div>
    );
  };
  return (
    <div className="fixed w-screen  h-screen top-0 left-0 z-40 bg-background lg:text-BASE">
      {/* Device Top Information Close Button */}
      <TopInformation />
      <div
        className={`flex flex-col bg-background w-full h-screen md:px-16 px-6
          overflow-x-scroll no-scrollbar`}
      >
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

export default EditDevicePage;
