import { useState } from "react";
import { NavLink } from "react-router-dom";
import useUsersContext from "../hooks/use-user-context";
import useAuth from "../hooks/useAuth";
import { BsChevronDown } from "react-icons/bs";

export default function Sidebarlink({ index, link, isHover, roles, linkInfo }) {
  const [open, setOpen] = useState(false);
  const activeClassName =
    "font-Bold rounded-md border-b-4 border-white pl-2 w-full";
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
            className="py-5 px-4 justify-start flex flex-col md:gap-0 gap-4 w-full"
          >
            {link.icon}
            <p className={` transition-all duration-300 px-4`}>{link.label}</p>
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
        <NavLink
          key={index}
          to={link.path}
          className={({ isActive }) =>
            isActive
              ? activeClassName
              : "w-full rounded-md border-b-2 border-transparent hover:border-white transition-all duration-300"
          }
          onClick={() => {
            if (link.label === "Logout") handleLogout();
          }}
        >
          <div className={`flex flex-col w-full items-center `}>
            {link.icon}
            <p className={`flex px-4`}>{link.label}</p>
          </div>
        </NavLink>
      );
    }
  }
}
