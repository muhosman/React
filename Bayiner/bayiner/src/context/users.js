import { createContext } from "react";
import axios from "axios";
import URL from "../url";
const UsersContext = createContext();

function UsersProvider({ children }) {
  const LogOut = async (token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${URL.url}users/logout`, config);
    return res;
  };

  const valueToShare = {
    LogOut,
  };

  return (
    <UsersContext.Provider value={valueToShare}>
      {children}
    </UsersContext.Provider>
  );
}

export { UsersProvider };
export default UsersContext;
