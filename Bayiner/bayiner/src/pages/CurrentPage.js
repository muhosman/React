import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const CurrentPage = () => {
  const location = useLocation();
  useEffect(() => {
    sessionStorage.setItem("currentPage", location.pathname);
  }, [location]);

  return <div>Current page : {location.pathname}</div>;
};

export default CurrentPage;
