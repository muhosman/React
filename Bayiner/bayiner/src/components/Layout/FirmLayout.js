import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

const FirmLayout = function () {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, []);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default FirmLayout;
