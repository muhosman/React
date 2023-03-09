import { useState } from "react";
import { NavLink } from "react-router-dom";
import useUsersContext from "../hooks/use-user-context";
import useAuth from "../hooks/useAuth";
import { BsChevronDown } from "react-icons/bs";

export default function Sidebarlink({ index, link, isHover, roles, linkInfo }) {
  const [open, setOpen] = useState(false);
  const activeClassName = "font-Bold border-l-4 border-white pl-2 w-full";
  const { LogOut } = useUsersContext();
  const { auth, setAuth } = useAuth();
  const handleLogout = async () => {
    try {
      const token = auth.accessToken;
      localStorage.clear();
      setAuth(null);
      await LogOut(token);
    } catch (err) {}
  };

  if (link.roles?.includes(auth?.role) !== false) {
    if (link.childrens) {
      return (
        <div className={`flex flex-col w-full`}>
          <button
            onClick={() => {
              setOpen(!open);
            }}
            className="py-5 px-4 justify-start flex md:gap-0 gap-4 w-full hover:bg-white hover:text-fourth"
          >
            {link.icon}
            <p
              className={` transition-all  ${linkInfo} ${
                isHover ? " duration-500 px-4" : "md:w-0 overflow-hidden"
              }`}
            >
              {link.label}
            </p>
            <BsChevronDown className=" " onClick={() => setOpen(!open)} />
          </button>
          <div className={`${open ? " flex flex-col pl-4 " : "hidden"}`}>
            {link?.childrens?.map((child, index) => (
              <Sidebarlink
                index={index}
                link={child}
                isHover={isHover}
                roles={roles}
                linkInfo={linkInfo}
              />
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className=" w-full flex">
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              isActive ? activeClassName : "w-full"
            }
            onClick={() => {
              if (link.label === "Logout") handleLogout();
            }}
          >
            <div className="flex gap-4 w-full h-12 items-center py-5 px-4 hover:bg-white hover:text-fourth">
              {link.icon}
              <p
                className={`flex transition-all ${linkInfo}  ${
                  isHover ? " duration-500 px-4" : "md:w-0 overflow-hidden"
                }`}
              >
                {link.label}
              </p>
            </div>
          </NavLink>
        </div>
      );
    }
  }
}
