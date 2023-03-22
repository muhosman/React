import avatar from "../img/avatar.png";
import { IoMdSave } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import { BsArrowLeftShort, BsFillTelephoneFill } from "react-icons/bs";
import { MdChangeCircle } from "react-icons/md";
import { SiMinutemailer } from "react-icons/si";
import { TiInfoLarge } from "react-icons/ti";

import useAuth from "../hooks/useAuth";
import Alerts from "./../components/Alert";
import { Blocks } from "react-loader-spinner";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRef } from "react";
import { useUpdateMeMutation, useUpdateMyPasswordMutation } from "../store";
import styles from "../CustomStyles";
import { style } from "@mui/system";
import Confirm from "../components/Confirm";

function ProfilePage() {
  const profileImg =
    "2xl:w-[28rem] 2xl:h-[20rem] xl:w-[22rem] xl:h-[16rem] md:w-[18rem] md:h-[12rem]";
  const [errMsg, setErrMsg] = useState("");
  const { auth, setAuth } = useAuth();
  const inputRefName = useRef(null);
  const inputRefTel = useRef(null);
  const inputRefLastName = useRef(null);
  const inputRefpasswordCurrent = useRef(null);
  const inputRefpassword = useRef(null);
  const inputRefpasswordConfirm = useRef(null);

  const [inputFocus, setInputFocus] = useState("quota");
  const [inputFieldName, setInputFieldName] = useState("");
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
  });
  const [userPassword, setUserPassword] = useState({
    passwordCurrent: "",
    password: "",
    passwordConfirm: "",
  });
  const [input, setInput] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [designModelProfile, setdesignModelProfile] = useState(false);
  const [designModelPassword, setdesignModelPassword] = useState(false);
  const [action, setAction] = useState(0);

  const handleModel = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
    setdesignModelProfile(false);
    setdesignModelPassword(false);
  };

  const handleCloseModel = (boolean) => {
    if (boolean) {
      if (action === 1) {
        if (userPassword.password === userPassword.passwordConfirm) {
          updateMyPassword({
            passwordCurrent: userPassword.passwordCurrent,
            password: userPassword.password,
            passwordConfirm: userPassword.passwordConfirm,
            id: auth._id,
            token: auth.accessToken,
          });
          updateMyPassword(input);
        } else {
          setErrMsg("Aynı şifreyi girmelisiniz !");
        }
      } else if (action === 2) {
        updateMe(input);
      }
      setAction(0);
      setInput("");
      setShowConfirmModal(false);
    } else {
      setShowConfirmModal(false);
      if (action === 3) setAction(0);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
    setInputFocus(name);
  };

  useEffect(() => {
    if (inputRefName.current && inputFocus === "name") {
      inputRefName.current.focus();
    }
  }, [inputRefName.current]);

  useEffect(() => {
    if (inputRefLastName.current && inputFocus === "lastName") {
      inputRefLastName.current.focus();
    }
  }, [inputRefLastName.current, inputFocus]);

  useEffect(() => {
    if (inputRefTel.current && inputFocus === "tel") {
      inputRefTel.current.focus();
    }
  }, [inputRefTel.current, inputFocus]);

  const DesignModelProfileInfo = () => {
    return (
      <form
        onSubmit={handleModel}
        className=" flex flex-col gap-6 sm:min-w-max w-full   "
      >
        <div
          className={`${styles.cardTitle} text-center w-full p-4 rounded-t-xl bg-fourth text-white`}
        >
          Profil Bilgileri Güncelleme
        </div>
        <div className="flex flex-col sm:gap-6 gap-2 min-w-max px-8 pb-4">
          <text className={` ${styles.textTitle}`}>İsim</text>
          <input
            className={`shadow bg-input ${styles.inputTag}`}
            id="name"
            name="name"
            value={input.name}
            ref={inputRefName}
            placeholder={"İsim"}
            required
            onInput={handleChange}
          />
        </div>
        <div className="flex flex-col sm:gap-6 gap-2 min-w-max px-8 pb-4">
          <text className={` ${styles.textTitle}`}>Soyisim</text>
          <input
            className={`shadow bg-input ${styles.inputTag}`}
            id="lastName"
            name="lastName"
            value={input.lastName}
            ref={inputRefLastName}
            placeholder={"Soy İsim"}
            required
            onInput={handleChange}
          />
        </div>
        <div className="flex flex-col sm:gap-6 gap-2 min-w-max px-8 pb-4">
          <text className={` ${styles.textTitle}`}>Telefon</text>
          <input
            className={`shadow bg-input ${styles.inputTag}`}
            id="tel"
            name="tel"
            value={input.tel}
            ref={inputRefTel}
            placeholder={"Telefon"}
            required
            onInput={handleChange}
          />
        </div>
        <button
          onClick={() => {}}
          className={`${styles.buttonSearch}  
          px-6 py-3 w-fit self-center mb-2`}
        >
          Kaydet
        </button>
      </form>
    );
  };

  useEffect(() => {
    if (inputRefpasswordCurrent.current && inputFocus === "passwordCurrent") {
      inputRefpasswordCurrent.current.focus();
    }
  }, [inputRefpasswordCurrent.current, inputFocus]);

  useEffect(() => {
    if (inputRefpassword.current && inputFocus === "password") {
      inputRefpassword.current.focus();
    }
  }, [inputRefpassword.current, inputFocus]);

  useEffect(() => {
    if (inputRefpasswordConfirm.current && inputFocus === "passwordConfirm") {
      inputRefpasswordConfirm.current.focus();
    }
  }, [inputRefpasswordConfirm.current, inputFocus]);

  const DesignModelPassword = () => {
    return (
      <form
        onSubmit={handleModel}
        className=" flex flex-col gap-6 sm:min-w-max w-full   "
      >
        <div
          className={`${styles.cardTitle} text-center w-full p-4 rounded-t-xl bg-fourth text-white`}
        >
          Profil Bilgileri Güncelleme
        </div>
        <div className="flex flex-col gap-6 min-w-max px-8 pb-4">
          <text className={` ${styles.textTitle}`}>Şifre</text>
          <input
            className={`shadow bg-input ${styles.inputTag}`}
            id="passwordCurrent"
            name="passwordCurrent"
            value={input.passwordCurrent}
            ref={inputRefpasswordCurrent}
            placeholder={"Şifre"}
            required
            onInput={handleChange}
          />
        </div>
        <div className="flex flex-col gap-6 min-w-max px-8 pb-4">
          <text className={` ${styles.textTitle}`}>Yeni Şifre</text>
          <input
            className={`shadow bg-input ${styles.inputTag}`}
            id="password"
            name="password"
            value={input.password}
            ref={inputRefpassword}
            placeholder={"Yeni Şifre"}
            required
            onInput={handleChange}
          />
        </div>
        <div className="flex flex-col gap-6 min-w-max px-8 pb-4">
          <text className={` ${styles.textTitle}`}>Yeni Şifre Onay</text>
          <input
            className={`shadow bg-input ${styles.inputTag}`}
            id="passwordConfirm"
            name="passwordConfirm"
            value={input.passwordConfirm}
            ref={inputRefpasswordConfirm}
            placeholder={"Yeni Şifre Onay"}
            required
            onInput={handleChange}
          />
        </div>
        <button
          onClick={() => {}}
          className={`${styles.buttonSearch}  
          px-6 py-3 w-fit self-center mb-2`}
        >
          Kaydet
        </button>
      </form>
    );
  };

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
      setUserInfo({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        tel: user.tel,
      });
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
      const accessToken = resultUpdateMyPassword?.data?.token;

      setAuth({ ...auth, accessToken: accessToken });
    }
  }, [resultUpdateMyPassword.isSuccess, resultUpdateMyPassword.isError]);

  return (
    <div className=" ">
      <Confirm
        input={input}
        inputFieldName={inputFieldName}
        handleCloseModel={handleCloseModel}
        showConfirmModal={showConfirmModal}
      />
      {designModelProfile && (
        <>
          <div
            onClick={() => {
              setInput("");
              setShowConfirmModal(false);
              setdesignModelProfile(false);
              setAction(0);
            }}
            className="fixed inset-0 z-40 bg-gray-300 opacity-80 "
          ></div>
          <div
            className={`fixed z-50 top-1/2 left-1/2 -translate-y-1/2 overflow-y-scroll no-scrollbar rounded-xl 
          -translate-x-1/2  sm:w-fit w-full max-sm:p-8 ${
            showConfirmModal ? "h-fit" : " max-h-[41rem]"
          }`}
          >
            <div
              className=" bg-white flex flex-col justify-center rounded-xl
          items-center sm:w-fit w-full h-fit"
            >
              {designModelProfile && <DesignModelProfileInfo />}
            </div>
          </div>
        </>
      )}
      {designModelPassword && (
        <>
          <div
            onClick={() => {
              setInput("");
              setShowConfirmModal(false);
              setdesignModelPassword(false);
              setAction(0);
            }}
            className="fixed inset-0 z-40 bg-gray-300 opacity-80 "
          ></div>
          <div
            className={`fixed z-50 top-1/2 left-1/2 -translate-y-1/2 overflow-y-scroll no-scrollbar rounded-xl 
          -translate-x-1/2  sm:w-fit w-full max-sm:p-8 ${
            showConfirmModal ? "h-fit" : " max-h-[41rem]"
          }`}
          >
            <div
              className=" bg-white flex flex-col justify-center rounded-xl
          items-center sm:w-fit w-full h-fit"
            >
              {designModelPassword && <DesignModelPassword />}
            </div>
          </div>
        </>
      )}
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
        <>
          <div className="relative sm:hidden bg-fourth h-[12rem] rounded-b-[8rem] w-full">
            <BsArrowLeftShort className=" absolute text-white w-[4rem] h-[4rem]" />
            <div className=" absolute left-1/2 -translate-x-1/2  w-fit transition-all duration-300 p-12">
              <img src={avatar} alt="Profile" className="max-w-[12rem]" />
            </div>
          </div>
          <div className="flex rounded-md w-full items-center sm:bg-white sm:shadow-md">
            <div className=" max-md:hidden  w-fit transition-all duration-300 p-12">
              <img src={avatar} alt="Profile" className={`${profileImg}`} />
            </div>
            <div className="flex max-md:flex-col w-full py-12 max-sm:mt-6">
              <div className="flex flex-col sm:gap-10 w-full">
                <div
                  className={` ${styles.DesignFieldHeader} max-sm:hidden flex gap-4  items-center`}
                >
                  Profil Bilgileri
                </div>
                <div className="flex gap-4 max-sm:py-4 max-sm:justify-center items-center max-sm:border-b-2 max-sm:border-t-2">
                  <div className="sm:hidden absolute left-6 bg-green-600 p-2 rounded-full text-white ">
                    <TiInfoLarge className=" w-[1.5rem] h-[1.5rem]" />
                  </div>
                  <p className={`${styles.tagText} max-sm:hidden`}>
                    İsim-Soyisim:{" "}
                  </p>
                  <p className={`${styles.inputTag} w-fit`}>
                    {userInfo.name} {userInfo.lastName}
                  </p>
                </div>

                <div className="flex gap-4 max-sm:py-4 max-sm:justify-center items-center max-sm:border-b-2">
                  <div className="sm:hidden absolute left-6 bg-purple-600 p-2 rounded-full text-white ">
                    <BsFillTelephoneFill className=" w-[1.5rem] h-[1.5rem]" />
                  </div>
                  <p className={`${styles.tagText} max-sm:hidden`}>Telefon: </p>
                  <p className={`${styles.inputTag} w-fit`}>{userInfo.tel}</p>
                </div>
                <div className="flex gap-4 max-sm:py-4 max-sm:justify-center items-center max-sm:border-b-2">
                  <div className="sm:hidden absolute left-6 bg-blue-600 p-2 rounded-full text-white ">
                    <SiMinutemailer className=" w-[1.5rem] h-[1.5rem]" />
                  </div>
                  <p className={`${styles.tagText} max-sm:hidden`}>E-mail: </p>
                  <p className={`${styles.inputTag} w-fit`}>{userInfo.email}</p>
                </div>
                <div className="flex gap-4 max-sm:py-4 sm:hidden justify-center max-sm:border-b-2">
                  <div className="sm:hidden absolute left-6 bg-red-500 p-2 rounded-full text-white ">
                    <RiLockPasswordLine className=" w-[1.5rem] h-[1.5rem]" />
                  </div>
                  <p className={`${styles.inputTag}  w-fit tracking-widest`}>
                    * * * * * * *
                  </p>
                  <MdChangeCircle
                    onClick={() => {
                      setInput({
                        ...input,
                        password: "",
                        passwordCurrent: "",
                        passwordConfirm: "",
                        id: auth._id,
                        token: auth.accessToken,
                      });
                      setInputFieldName({
                        password: "Yeni Şifre",
                      });
                      setdesignModelPassword(true);
                      setAction(1);
                    }}
                    className=" text-fourth w-[2rem] h-[2rem]"
                  />
                </div>
                <div
                  className=" flex self-center absolute bottom-12 px-4 gap-4 border-2 border-transparent text-white hover:text-fourth
                hover:border-fourth hover:bg-white sm:hidden bg-fourth w-fit rounded-md justify-center items-center"
                >
                  <button
                    onClick={() => {
                      setInput({
                        ...input,
                        name: auth.name,
                        lastName: auth.lastName,
                        email: auth.email,
                        tel: auth.tel,
                        id: auth._id,
                        token: auth.accessToken,
                      });
                      setInputFieldName({
                        name: "İsim",
                        lastName: "Soy İsim",
                        tel: "Telefon",
                      });
                      setdesignModelProfile(true);
                      setAction(2);
                    }}
                    className={` flex items-center `}
                  >
                    <IoMdSave className={`w-[3rem] h-[3rem]  `} />
                    <p className={`${styles.inputTag} `}>Profili Düzenle</p>
                  </button>
                </div>
              </div>
              <div className="max-sm:hidden flex gap-4 mr-12 items-center">
                <button
                  onClick={() => {
                    setInput({
                      ...input,
                      name: auth.name,
                      lastName: auth.lastName,
                      email: auth.email,
                      tel: auth.tel,
                      id: auth._id,
                      token: auth.accessToken,
                    });
                    setInputFieldName({
                      name: "İsim",
                      lastName: "Soy İsim",
                      tel: "Telefon",
                    });
                    setdesignModelProfile(true);
                    setAction(2);
                  }}
                  className={` flex `}
                >
                  <IoMdSave
                    className={` xl:w-[4rem] xl:h-[4rem] text-fourth`}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="flex mt-8 rounded-md sm:bg-white sm:shadow-md">
            <div className="flex w-full py-12 items-center ml-12">
              <div className="flex flex-col gap-10 w-full">
                <div className="flex gap-4  items-center">
                  <p className={`${styles.tagText} max-sm:hidden`}>
                    Şuanki Şifre:{" "}
                  </p>
                  <p
                    className={`${styles.inputTag} max-sm:hidden w-fit tracking-widest`}
                  >
                    * * * * * * *
                  </p>
                </div>
              </div>

              <div className=" max-sm:hidden flex gap-4 mr-12 items-center">
                <button
                  onClick={() => {
                    setInput({
                      ...input,
                      password: "",
                      passwordCurrent: "",
                      passwordConfirm: "",
                      id: auth._id,
                      token: auth.accessToken,
                    });
                    setInputFieldName({
                      password: "Yeni Şifre",
                    });
                    setdesignModelPassword(true);
                    setAction(1);
                  }}
                  className={` flex `}
                >
                  <RiLockPasswordLine
                    className={` xl:w-[4rem] xl:h-[4rem] text-fourth`}
                  />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProfilePage;
