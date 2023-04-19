import React from "react";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LogoImage from "../../img/logo.png";
import styles from "../../CustomStyles";
import { useForgotPasswordMutation, useLoginMutation } from "../../store";
import Alerts from "../../components/Alert";
import { Blocks } from "react-loader-spinner";

export default function LoginPage() {
  const [forgotPassword, resultForgotPassword] = useForgotPasswordMutation();
  const [Login, resultLogin] = useLoginMutation();
  const { setAuth } = useAuth();
  const [pwd, setPwd] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [login, setLogin] = useState(true);

  const [alert, setAlert] = useState(0); // 1- success 2-error 3-warning
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (alert !== 0) {
      setTimeout(() => {
        setAlert(0);
        setMessage("");
      }, 2000);
    }
  }, [alert]);

  useEffect(() => {
    if (resultForgotPassword.isError === true) {
      setAlert(2);
      setMessage("İşlem başarısız tekrar deneyin !");
    }
    if (resultForgotPassword.isSuccess === true) {
      setAlert(1);
      setMessage("Şifreniz başarı ile oluşturuldu !");
    }
  }, [resultForgotPassword.isSuccess, resultForgotPassword.isError]);

  useEffect(() => {
    if (resultLogin.isError === true) {
      setAlert(2);
      setMessage("İşlem başarısız tekrar deneyin !");
    }
    if (resultLogin.isSuccess === true) {
      setAlert(1);
      setMessage("Giriş başarılı !");
      const accessToken = resultLogin?.data?.token;
      const user = resultLogin?.data?.data?.user;
      setAuth({ ...user, accessToken });
      if (user?.role === "management" || user?.role === "admin")
        navigate("/Anasayfa/Dashboard");
      else if (user?.role === "accounting") navigate("/Anasayfa/Firma");
      else if (user?.role === "manufacture") navigate("/Anasayfa/Stok");
      else if (user?.role === "playmaker") navigate("/Anasayfa/Profil");
    }
  }, [resultLogin.isSuccess, resultLogin.isError]);

  const handleForgetPassword = (e) => {
    e.preventDefault();
    forgotPassword(email);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    Login({ password: pwd, email: email });
  };

  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden text-black md:bg-fourth bg-white">
      {alert !== 0 && (
        <div
          className="fixed z-50 left-1/2 top-0
    -translate-x-1/2"
        >
          <Alerts AlertChoice={alert} message={message} />
        </div>
      )}
      {resultForgotPassword.isLoading || resultForgotPassword.isLoading ? (
        <div className=" flex w-full h-full justify-center items-center">
          <Blocks
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
          />
        </div>
      ) : (
        <div className="flex w-full justify-center">
          <div className={`${styles.LoginInputField}`}>
            <div className={`${styles.LoginLogo}`}>
              <img src={LogoImage} title="logo" alt="logo" />
            </div>
            <form
              className={`${login ? "flex flex-col w-full" : "hidden"}`}
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col">
                <div htmlFor="email" className="flex items-center mb-2">
                  <HiOutlineMail className={`${styles.LoginTagIcon}`} />
                  <p className={`${styles.LogintagText}`}>Email</p>
                </div>
                <input
                  type="text"
                  id="email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  className={`${styles.LogininputTag}`}
                />
              </div>
              <div className="mt-6 flex flex-col">
                <div htmlFor="password" className="flex items-center mb-2">
                  <RiLockPasswordLine className={`${styles.LoginTagIcon}`} />
                  <p className={`${styles.LogintagText}`}>Şifre</p>
                </div>
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  className={`${styles.LogininputTag}`}
                />
              </div>

              <div className="flex flex-col items-center mt-6 gap-4">
                <button className={`${styles.LoginButton}`}>Giriş</button>
                <div
                  onClick={() => {
                    setLogin(false);
                    setEmail("");
                    setPwd("");
                  }}
                  className="hover:underline cursor-pointer"
                >
                  <p className={`${styles.LoginChangeText}`}>Şifremi Unuttum</p>
                </div>
              </div>
            </form>

            <form
              className={`${login ? "hidden" : ""}`}
              onSubmit={handleForgetPassword}
            >
              <div className="flex flex-col mb-2">
                <div htmlFor="email" className="flex items-center mb-2">
                  <HiOutlineMail className={`${styles.LoginTagIcon}`} />
                  <p className={`${styles.LogintagText}`}>Email</p>
                </div>
                <input
                  type="text"
                  id="Email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  className={`${styles.LogininputTag}`}
                />
              </div>
              <div className="flex flex-col items-center gap-4 mt-14">
                <button className={`${styles.LoginButton}`}>Gönder</button>
                <div
                  onClick={() => {
                    setLogin(true);
                    setEmail("");
                  }}
                  className="hover:underline cursor-pointer"
                >
                  <p className={`${styles.LoginChangeText}`}>
                    Giriş Sayfasına Dön
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
