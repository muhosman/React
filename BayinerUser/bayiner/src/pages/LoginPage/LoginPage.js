import React from "react";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LogoImage from "../../img/logo.png";

import { useForgotPasswordMutation, useLoginMutation } from "../../store";
import Alerts from "../../components/Alert";
import { Blocks } from "react-loader-spinner";

export default function LoginPage() {
  const InputField =
    "flex flex-col justify-center gap-[6rem] px-[4rem] py-[6rem] transition-all duration-500 rounded-xl bg-white sm:shadow-slate-800 sm:shadow-md ";
  const Logo = "xl:w-[16rem] w-[9rem] self-center ";
  const TagIcon = "xl:w-9 xl:h-9 w-8 h-8 text-fourth";
  const tagText = "xl:text-2xl font-SemiBold ml-2 text-fourth ";
  const inputTag =
    "xl:text-XL text-BASE h-[2.5rem] rounded-md shadow-lg border-[1px] border-slate-400 p-3 bg-slate-200";
  const Button =
    "xl:text-XL text-BASE tracking-widest items-center gap-4 text-white flex bg-fourth rounded-md px-4 py-2 transition-all duration-300 active:scale-90";

  const ChangeText = " xl:text-BASE text-SM font-Medium text-fourth";

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
      navigate("/Anasayfa/Profil");
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
    <div className="flex items-center justify-center min-h-screen overflow-hidden text-black bg-white">
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
          <div id="container">
            <div id="container-class">
              <div id=" info">
                <p class="main-page">"Kahve bizim işimiz "</p>
              </div>
            </div>
          </div>
          <div className={`${InputField}`}>
            <div className={`${Logo}`}>
              <img src={LogoImage} title="logo" alt="logo" />
            </div>
            <form
              className={`${login ? "flex flex-col w-full" : "hidden"}`}
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col">
                <div htmlFor="email" className="flex items-center mb-2">
                  <HiOutlineMail className={`${TagIcon}`} />
                  <p className={`${tagText}`}>Email</p>
                </div>
                <input
                  type="text"
                  id="email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  className={`${inputTag}`}
                />
              </div>
              <div className="mt-6 flex flex-col">
                <div htmlFor="password" className="flex items-center mb-2">
                  <RiLockPasswordLine className={`${TagIcon}`} />
                  <p className={`${tagText}`}>Şifre</p>
                </div>
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  className={`${inputTag}`}
                />
              </div>

              <div className="flex flex-col items-center mt-6 gap-4">
                <button className={`${Button}`}>Giriş</button>
                <div
                  onClick={() => {
                    setLogin(false);
                    setEmail("");
                    setPwd("");
                  }}
                  className="hover:underline cursor-pointer"
                >
                  <p className={`${ChangeText}`}>Şifremi Unuttum</p>
                </div>
              </div>
            </form>

            <form
              className={`${login ? "hidden" : ""}`}
              onSubmit={handleForgetPassword}
            >
              <div className="flex flex-col mb-2">
                <div htmlFor="email" className="flex items-center mb-2">
                  <HiOutlineMail className={`${TagIcon}`} />
                  <p className={`${tagText}`}>Email</p>
                </div>
                <input
                  type="text"
                  id="Email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  className={`${inputTag}`}
                />
              </div>
              <div className="flex flex-col items-center gap-4 mt-14">
                <button className={`${Button}`}>Gönder</button>
                <div
                  onClick={() => {
                    setLogin(true);
                    setEmail("");
                  }}
                  className="hover:underline cursor-pointer"
                >
                  <p className={`${ChangeText}`}>Giriş Sayfasına Dön</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
