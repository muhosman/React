import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import Password from "./password";
import DesignPage from "./design";

export default function Setting() {
  const [selected, setSelected] = useState("password");
  const { auth, setAuth } = useAuth();

  return (
    <div className=" overflow-hidden w-full h-full">
      <div className="flex border-b-4  border-menuBar text-2xl w-full relative">
        <div
          className={` absolute h-full w-1/4 py-2 bg-menuBar transform transition-transform duration-300 ease-in-out ${
            selected === "password"
              ? " translate-x-0"
              : selected === "service"
              ? "translate-x-[200%]"
              : "translate-x-[100%]"
          }`}
        ></div>
        <div
          className={` text-center py-2  w-1/4 z-10 ${
            selected === "password" ? "text-menuBarText" : "text-menuBar"
          }`}
          onTouchStart={() => {
            setSelected("password");
          }}
        >
          Şifre Ayarları
        </div>
        <div
          className={`w-1/4 z-10 text-center py-2 ${
            selected === "design" ? "text-menuBarText" : "text-menuBar"
          }`}
          onTouchStart={() => setSelected("design")}
        >
          Görüntü Ayarı
        </div>
        {auth.role === "Service" && (
          <div
            className={`w-1/4 z-10 text-center py-2 ${
              selected === "service" ? "text-menuBarText" : "text-menuBar"
            }`}
            onTouchStart={() => setSelected("service")}
          >
            Servis Panel
          </div>
        )}
      </div>

      <div className="w-full h-full  mt-14 relative">
        <div
          className={` ${
            selected === "password" ? "left-0" : " -left-[54rem]"
          } h-full w-full absolute -top-5 transition-all duration-500 flex `}
        >
          <Password />
        </div>
        <div
          className={` ${
            selected === "design" ? "left-0" : " -left-[54rem]"
          } h-full w-full absolute -top-5 transition-all duration-500 flex `}
        >
          <DesignPage />
        </div>
        <div
          className={` ${
            selected === "service" ? "left-0" : " -left-[54rem]"
          } h-full w-full absolute top-0 transition-all duration-500 flex flex-col items-center gap-12 `}
        ></div>
      </div>
    </div>
  );
}
