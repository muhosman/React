import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const DeviceLayout = function () {
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

export default DeviceLayout;
