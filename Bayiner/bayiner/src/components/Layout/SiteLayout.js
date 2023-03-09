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
        <div className="md:mt-4 mt-12 w-1200">
          <div className="md:ml-40">
            <Sidebar />
            <div className=" md:mt-16 mt-28">
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteLayout;
