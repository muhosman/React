import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Menu from "../components/menu";
import { RotatingTriangles } from "react-loader-spinner";
import BottonInfo from "../components/bottomInfo";

export default function MainLayout() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
    setTimeout(() => {
      setLoad(false);
    }, 2000);
  }, []);

  return (
    <div>
      {load ? (
        <div className=" flex flex-col gap-4 w-screen h-screen justify-center items-center">
          <RotatingTriangles
            visible={true}
            height="80"
            width="80"
            ariaLabel="rotating-triangels-loading"
            wrapperStyle={{}}
            wrapperClass="rotating-triangels-wrapper"
            colors={["#0b377e", "#f7931d", "#cc123c"]}
          />
        </div>
      ) : (
        <div className="">
          <div className="">
            <Menu />
            <div className="mb-[12rem] mt-[12rem] mx-[18rem]">
              <Outlet />
            </div>
            <BottonInfo />
          </div>
        </div>
      )}
    </div>
  );
}
