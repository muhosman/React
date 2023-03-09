import { useContext } from "react";
import LoginContext from "./LoginPageConfig.js";

function useLoginContext() {
  return useContext(LoginContext);
}

export default useLoginContext;
