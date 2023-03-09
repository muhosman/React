import avatar from "../img/avatar.png";
import { IoMdSave } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import useAuth from "../hooks/useAuth";
import Alerts from "./../components/Alert";
import { Blocks } from "react-loader-spinner";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUpdateMeMutation, useUpdateMyPasswordMutation } from "../store";

function ProfilePage() {
  const input =
    "mt-4 h-12 w-full bg-transparent text-center bg-slate-100 rounded-lg shadow-md border-[1px] border-black";
  const [errMsg, setErrMsg] = useState("");
  const { auth, setAuth } = useAuth();
  const { id } = useParams();
  const [updateMe, resultUpdateMe] = useUpdateMeMutation();
  const [updateMyPassword, resultUpdateMyPassword] =
    useUpdateMyPasswordMutation();
  const [alert, setAlert] = useState(0); // 1- success 2-error 3-warning
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState({
    name: auth.name,
    lastName: auth.lastName,
    email: auth.email,
    tel: auth.tel,
    id: auth._id,
    token: auth.accessToken,
  });
  const [userPassword, setUserPassword] = useState({
    passwordCurrent: "",
    password: "",
    passwordConfirm: "",
    token: auth.accessToken,
  });

  useEffect(() => {
    if (alert !== 0) {
      setTimeout(() => {
        setAlert(0);
        setMessage("");
      }, 2000);
    }
  }, [alert]);

  useEffect(() => {
    if (resultUpdateMe.isError === true) {
      setAlert(2);
      setMessage("İşlem başarısız tekrar deneyin !");
    }
    if (resultUpdateMe.isSuccess === true) {
      setAlert(1);
      setMessage("Profil başarı ile güncellendi !");
      const user = resultUpdateMe?.data?.data?.user;
      setAuth({ ...user, accessToken: auth.accessToken });
    }
  }, [resultUpdateMe.isSuccess, resultUpdateMe.isError]);

  useEffect(() => {
    if (resultUpdateMyPassword.isError === true) {
      setAlert(2);
      setMessage("İşlem başarısız tekrar deneyin !");
    }
    if (resultUpdateMyPassword.isSuccess === true) {
      setAlert(1);
      setMessage("İşlem başarı ile gerçekleşti !");
      const user = resultUpdateMe?.data?.data?.user;
      const accessToken = resultUpdateMyPassword?.data?.data?.token;
      setAuth({ ...user, accessToken: accessToken });
    }
  }, [resultUpdateMyPassword.isSuccess, resultUpdateMyPassword.isError]);

  const handleUpdateUser = (event) => {
    event.preventDefault();
    updateMe(userInfo);
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    if (userPassword.password === userPassword.passwordConfirm) {
      updateMyPassword({
        passwordCurrent: userPassword.passwordCurrent,
        password: userPassword.password,
        passwordConfirm: userPassword.passwordConfirm,
        id: auth._id,
        token: auth.accessToken,
      });
      console.log(auth.accessToken);
    } else {
      setErrMsg("Aynı şifreyi girmelisiniz !");
    }
  };

  return (
    <div className="mt-24 mb-12 mr-24 ml-20">
      {alert !== 0 && (
        <div
          className="fixed z-50 left-1/2 top-0
    -translate-x-1/2"
        >
          <Alerts AlertChoice={alert} message={message} />
        </div>
      )}
      {resultUpdateMe.isLoading || resultUpdateMyPassword.isLoading ? (
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
        <div className="row-start-2 grid xl:grid-cols-2 grid-cols-1">
          <form
            onSubmit={handleUpdateUser}
            className=" shadow-2xl w-full xl:rounded-tl-2xl xl:rounded-bl-2xl 
          xl:rounded-tr-none xl:border-r-4 xl:border-b-0 rounded-t-2xl border-b-4 border-fourth
           bg-white py-10 flex flex-col justify-center items-center relative px-28 pt-20 pb-10
        "
          >
            <div
              className="  w-full font-SemiBold tracking-widest
          xl:rounded-tl-2xl 
          xl:rounded-tr-none rounded-t-2xl
          text-center mb-5 self-center bg-fourth text-white absolute top-0 py-5"
            >
              Profil Bilgileri
            </div>
            <div className="flex flex-col gap-10 w-full  mt-5 justify-between">
              <div className="flex flex-col justify-center items-center">
                <p className="font-bold border-black border-b-2">İsim</p>
                <input
                  className={`${input}`}
                  value={userInfo.name}
                  maxLength="20"
                  onChange={(e) => {
                    var lowerCase = e.target.value;
                    setUserInfo({ ...userInfo, name: lowerCase });
                  }}
                />
              </div>
              <div className="flex flex-col justify-center items-center">
                <p className="font-bold border-black border-b-2">Soyisim</p>
                <input
                  className={`${input}`}
                  value={userInfo.lastName}
                  maxLength="20"
                  onChange={(e) => {
                    var lowerCase = e.target.value;

                    setUserInfo({ ...userInfo, lastName: lowerCase });
                  }}
                />
              </div>
              <div className="flex flex-col justify-center items-center bg-transparent">
                <p className="font-bold border-black border-b-2 ">
                  Telefon Numarası
                </p>
                <input
                  className={`${input}`}
                  value={userInfo.tel}
                  maxLength="15"
                  onChange={(e) => {
                    var lowerCase = e.target.value;

                    setUserInfo({ ...userInfo, tel: lowerCase });
                  }}
                />
              </div>
              <div className="flex flex-col justify-center items-center">
                <p className="font-bold border-black border-b-2">E-mail</p>
                <input
                  className={`${input} bg-gray-400`}
                  value={userInfo.email}
                  maxLength="10"
                  disabled
                />
              </div>
              <div className="flex items-center justify-center col-span-2">
                <button className="items-center gap-2 mt-10 w-fit text-white active:text-white hover:text-fourth 2xl:col-start-4 xl:col-start-3 md:col-start-2 flex bg-fourth rounded-br-2xl rounded-tl-2xl px-6 py-3 active:bg-fourth  hover:bg-white transition-all duration-300">
                  <IoMdSave className=" 2xl:w-6 2xl:h-6 w-5 h-5" />
                  <p className="">Kaydet</p>
                </button>
              </div>
            </div>
          </form>
          <form
            onSubmit={handlePasswordChange}
            className=" relative shadow-2xl xl:rounded-tr-2xl xl:rounded-br-2xl xl:rounded-bl-none rounded-b-2xl bg-white px-28 pt-20 pb-10 flex justify-center
        "
          >
            <div
              className=" w-full font-SemiBold tracking-widest
          xl:rounded-tr-2xl 
          xl:rounded-tl-none rounded-t-2xl
          text-center mb-5 self-center bg-fourth text-white absolute top-0 py-5"
            >
              Şifre Yenile
            </div>
            <div className="flex flex-col gap-4 justify-between w-full mt-5">
              <div className="flex flex-col items-center gap-2 w-full">
                <p className="font-bold border-black border-b-2">
                  Şuanki Şifre
                </p>
                <input
                  className={`${input}`}
                  type="passwordCurrent"
                  value={userPassword.passwordCurrent}
                  required
                  maxLength="15"
                  onChange={(e) => {
                    var lowerCase = e.target.value;
                    setErrMsg(undefined);
                    setUserPassword({
                      ...userPassword,
                      passwordCurrent: lowerCase,
                    });
                  }}
                />
              </div>

              <div className="flex flex-col items-center gap-2">
                <p className="font-bold border-black border-b-2">Yeni Şifre</p>
                <input
                  className={`${input}`}
                  type="passwordCurrent"
                  value={userPassword.password}
                  maxLength="15"
                  required
                  onChange={(e) => {
                    var lowerCase = e.target.value;
                    setErrMsg(undefined);

                    setUserPassword({ ...userPassword, password: lowerCase });
                  }}
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="font-bold border-black border-b-2">
                  Yeni Şifre Tekrar
                </p>
                <input
                  className={`${input}`}
                  type="passwordCurrent"
                  value={userPassword.passwordConfirm}
                  maxLength="15"
                  required
                  onChange={(e) => {
                    var lowerCase = e.target.value;
                    setErrMsg(undefined);

                    setUserPassword({
                      ...userPassword,
                      passwordConfirm: lowerCase,
                    });
                  }}
                />
              </div>
              <div className="flex justify-center">
                <button className="items-center gap-2 mt-10 w-fit text-white active:text-white hover:text-fourth 2xl:col-start-4 xl:col-start-3 md:col-start-2 flex bg-fourth rounded-br-2xl rounded-tl-2xl px-6 py-3 active:bg-fourth  hover:bg-white transition-all duration-300">
                  <RiLockPasswordLine className=" 2xl:w-6 2xl:h-6 w-5 h-5" />
                  <p className="">Şifre Değiştir</p>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
