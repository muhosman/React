import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

const SiteLayout = function () {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, []);

  return (
    <div>
      {load ? (
        <div className=" flex flex-col gap-4 w-screen h-screen justify-center items-center">
          <div class="cup" style={{ width: "160px", height: "120px" }}>
            <span class="steam"></span>
            <span class="steam"></span>
            <span class="steam"></span>
            <div
              class="cup-handle"
              style={{ width: "60px", height: "50px" }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="w-1200">
          <Sidebar />
          <div className="xl:mx-40 md:mx-32 sm:mx-20 ">
            <div className=" sm:mt-28">
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteLayout;
