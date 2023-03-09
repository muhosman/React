import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

//Icons
import { AiFillDelete } from "react-icons/ai";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

import { HiOutlinePencilAlt } from "react-icons/hi";
import styles from "../../CustomStyles";

function EditUserPage() {
  const location = useLocation();
  const { id } = useParams();
  const [Info, setInfo] = useState();

  useEffect(() => {
    if (location.pathname === `/Anasayfa/users/edit/${id}/delete`) setInfo(1);
    if (location.pathname === `/Anasayfa/users/edit/${id}/info`) setInfo(0);
  }, [location]);

  const TopClick = function (PageNumber) {
    setInfo(PageNumber);
  };

  const TopInformation = function () {
    return (
      <div className="absolute top-0 bg-fourth z-50 w-full h-fit flex justify-between">
        <div className="flex">
          <NavLink to="info">
            <button
              onClick={() => {
                TopClick(0);
              }}
              className={`${
                Info === 0 ? "bg-background  " : "bg-fourth text-white"
              } flex px-6 py-3 z-20 transition-all duration-500  
     hover:bg-background  hover:text-fourth gap-4`}
            >
              <div className="flex justify-center items-center pt-2">
                <HiOutlinePencilAlt className={`${styles.PageHeaderIcon}`} />
                <p className={`${styles.PageHeader}`}>Kullanıcı Düzenleme</p>
              </div>
            </button>
          </NavLink>
          <NavLink to="delete">
            <button
              onClick={() => {
                TopClick(1);
              }}
              className={`${
                Info === 1 ? "bg-background  " : "bg-fourth text-white"
              } flex px-6 py-3 z-20 transition-all duration-500  
     hover:bg-background  hover:text-fourth gap-4`}
            >
              <div className="flex justify-center items-center pt-2">
                <AiFillDelete className={`${styles.PageHeaderIcon}`} />
                <p className={`${styles.PageHeader}`}>Kullanıcı Sil</p>
              </div>
            </button>
          </NavLink>
        </div>
        <NavLink to="/Anasayfa/users">
          <button
            className={`flex px-8 py-2 transition-all duration-200  text-white
       h-14 z-10 justify-center items-center
      hover:text-fifth w-fit `}
          >
            <MdOutlineKeyboardBackspace
              className={`${styles.PageHeaderExitIcon}`}
            />
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
          mt-20 mb-20 flex-col justify-between gap-4 p-8 rounded-xl text-black`}
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

export default EditUserPage;
