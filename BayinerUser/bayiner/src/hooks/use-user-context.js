import { useContext } from "react";
import UsersContext from "../context/users.js";

function useUsersContext() {
  return useContext(UsersContext);
}

export default useUsersContext;
