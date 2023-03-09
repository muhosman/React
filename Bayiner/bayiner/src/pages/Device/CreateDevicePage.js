import { useState, useEffect } from "react";
import Dropdown from "../../components/DropDown";
import { AiOutlineWifi } from "react-icons/ai";
import { MdCoffeeMaker } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Alerts from "../../components/Alert";
import { Blocks } from "react-loader-spinner";
import { NavLink } from "react-router-dom";
import Confirm from "../../components/Confirm";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { FaCircleNotch } from "react-icons/fa";
import {
  useAddDeviceMutation,
  useFetchDeviceTypeQuery,
  useFetchGSMQuery,
} from "../../store";
import useAuth from "../../hooks/useAuth";
import styles from "../../CustomStyles";

function CreateDeviceModals() {
  const navigate = useNavigate();

  const inputFieldName = {
    name: "Cihaz İsmi",
    ip: "IP Numarası",
    gsmNo: "Gsm Numarası",
    serialNo: "Seri Numarası",
    imei: "IMEI Numarası",
    userPassword: "Kullanıcı Şifre",
    adminPassword: "Admin Şifre",
  };
  const [input, setInput] = useState([]);

  const { auth } = useAuth();
  const token = auth.accessToken;
  const [alert, setAlert] = useState(0); // 1- success 2-error 3-warning
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [errorAdmin, setErrorAdmin] = useState(false);
  const [connection, setConnection] = useState(0);

  const [add, resultAdd] = useAddDeviceMutation();
  const responseDeviceType = useFetchDeviceTypeQuery(token);

  const deviceTypes = responseDeviceType.data?.data?.deviceTypes || [];
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const GSM = useFetchGSMQuery(token).data?.data?.gsmInfos || "";

  useEffect(() => {
    if (alert !== 0) {
      setTimeout(() => {
        if (alert === 1) {
          setAlert(0);
          setMessage("");
          navigate("/Anasayfa/Cihaz");
        }
        setAlert(0);
        setMessage("");
      }, 2000);
    }
  }, [alert]);

  useEffect(() => {
    if (resultAdd.isError === true) {
      setAlert(2);
      setMessage("İşlem başarısız tekrar deneyin !");
      console.log(resultAdd);
    }
    if (resultAdd.isSuccess === true) {
      setAlert(1);
      setMessage("İşlem başarı ile gerçekleşti !");
    }
  }, [resultAdd.isSuccess, resultAdd.isError]);

  const handlePasswordValidation = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleAdminPasswordValidation = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      setErrorAdmin(true);
    } else {
      setErrorAdmin(false);
    }
  };

  const handleOpenModal = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleCloseModel = (bool) => {
    if (bool) {
      add({ input, token });
      setShowConfirmModal(false);
    } else {
      setShowConfirmModal(false);
    }
  };

  const deviceTypesOption = deviceTypes.map((item) => {
    return { label: item.name, value: item.name };
  });

  const handleSelectDevice = (option) => {
    deviceTypes.map((item) => {
      if (option.value === item.name) {
        setInput({
          ...input,
          typeID: item._id,
          name: item.name,
        });
      }
    });
  };

  return (
    <div className="fixed w-screen h-screen top-0 left-0 z-50 bg-white">
      {/*
          Confirm Modal
      */}
      {alert !== 0 && (
        <div
          className="fixed z-50 left-1/2 top-0
    -translate-x-1/2"
        >
          <Alerts AlertChoice={alert} message={message} />
        </div>
      )}
      <Confirm
        input={input}
        inputFieldName={inputFieldName}
        handleCloseModel={handleCloseModel}
        showConfirmModal={showConfirmModal}
      />
      {/*
          Top Absolute Information
      */}
      <div className="absolute top-0 bg-fourth z-30 w-full h-fit flex justify-between">
        <div className="flex justify-center items-center h-fit bg-fourth text-white p-4">
          <MdCoffeeMaker className={`mr-2 ${styles.PageHeaderIcon}`} />
          <p className={`${styles.PageHeader}`}>Cihaz Ekle</p>
        </div>

        <NavLink to="/Anasayfa/Cihaz">
          <button
            className={`flex px-8 py-2 transition-all duration-200  text-white
           h-14 z-10 justify-center items-center
          hover:text-fifth w-fit `}
          >
            <MdOutlineKeyboardBackspace
              className={`${styles.PageHeaderIcon}`}
            />
          </button>
        </NavLink>
      </div>

      {/*
          Device information.
      */}
      {resultAdd.isLoading ? (
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
        <div className="flex flex-col bg-background md:m-auto mx-10  h-screen gap-6 md:px-16 ">
          <form
            onSubmit={handleOpenModal}
            className={`flex mt-24 mb-20 flex-col overflow-y-scroll no-scrollbar justify-between`}
          >
            <div className="flex flex-col md:flex-row border-b-4 border-fourth w-full mb-4">
              <p
                className={` w-full self-center ml-2 mb-2 ${styles.DesignFieldHeader}`}
              >
                Cihaz Bilgileri
              </p>
            </div>
            <div className=" flex flex-col gap-4 bg-white rounded-lg shadow-xl p-8 h-fit">
              <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mb-2 items-center justify-between "></div>
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10 h-fit">
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} ml-3`}>Cihaz Tipi</p>
                  <Dropdown
                    options={deviceTypesOption}
                    value={{
                      label: input.name,
                      value: input.name,
                    }}
                    DropDownPanel={styles.DropDownPanel}
                    text={styles.DropDownText}
                    onChange={handleSelectDevice}
                    search={true}
                    barValue={"Cihaz Tipi"}
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div className="flex gap-6 w-full ">
                    <p className={`${styles.tagText} ml-3`}>IP</p>
                    <div
                      id="connectButton"
                      className={`flex items-center justify-center hover:text-green-400  gap-1 text-slate-800  transition duration-500 mb-2`}
                    >
                      <FaCircleNotch
                        className={`${
                          connection === 1
                            ? "animate-spin text-green-600  "
                            : "hidden"
                        } ${styles.buttonIcon}`}
                      />
                      <p
                        className={`${
                          connection === 1 ? " text-green-600" : "hidden"
                        }${connection === 1 ? styles.tagText : ""} `}
                      >
                        Bağlanıyor...
                      </p>
                      <RxCross2
                        className={`${
                          connection === 3 ? "text-red-600" : "hidden"
                        } ${styles.buttonIcon}`}
                      />
                      <p
                        className={`${
                          connection === 3 ? "text-red-600" : "hidden"
                        } ${connection === 3 ? styles.tagText : ""} `}
                      >
                        Bağlanamadı
                      </p>
                      <TiTick
                        className={`${
                          connection === 2 ? "text-green-600" : "hidden"
                        } ${styles.buttonIcon}`}
                      />
                      <p
                        className={`${
                          connection === 2 ? "text-green-600" : "hidden"
                        } ${connection === 2 ? styles.tagText : ""}`}
                      >
                        Bağlantı Başarılı
                      </p>
                      <div
                        onClick={() => {
                          setInput({
                            ...input,
                            gsmNo: "",
                            serialNo: "",
                            imei: "",
                          });
                          setConnection(1);
                          var flag = 0;
                          if (input.ip.length >= 6) {
                            GSM.map((gsm) => {
                              if (input.ip === gsm.ip) {
                                flag = 1;
                                setConnection(2);
                                setInput({
                                  ...input,
                                  gsmNo: gsm.gsmNo,
                                  serialNo: gsm.serialNo,
                                  imei: gsm.imei,
                                });
                              }
                            });
                          }
                          if (flag === 0) {
                            setConnection(3);
                          }
                        }}
                        className={`${
                          connection !== 0
                            ? "hidden"
                            : "flex  cursor-pointer gap-3"
                        }`}
                      >
                        <AiOutlineWifi
                          className={` ${styles.buttonIcon} animate-bounce text-orange-600`}
                        />
                        <div className="flex items-center justify-center text-orange-600 ">
                          <p className={`${styles.tagText}`}>Bağlan</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <input
                    className={`${styles.inputTag}`}
                    value={input.ip}
                    maxLength="25"
                    required
                    onKeyPress={(event) => {
                      if (!/[\d\.]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onClick={() => {
                      setConnection(0);
                    }}
                    onChange={(e) => {
                      var lowerCase = e.target.value;
                      setInput({ ...input, ip: lowerCase });
                    }}
                  />
                </div>

                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} ml-3 `}>Seri No</p>
                  <input
                    className={`${styles.inputTag} `}
                    value={input.serialNo}
                    disabled
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <p className={`ml-3 ${styles.tagText} `}>GSM No</p>
                  <input
                    className={`${styles.inputTag} `}
                    value={input.gsmNo}
                    disabled
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} ml-3`}>IMEI</p>
                  <input
                    className={`${styles.inputTag} `}
                    value={input.imei}
                    disabled
                  />
                </div>

                <div>
                  <p className={`${styles.tagText} mb-2 ml-3`}>
                    Kullanıcı Şifresi
                  </p>
                  <input
                    className={`${styles.inputTag}
                    ${error ? "border-red-500" : ""}`}
                    value={input.userPassword}
                    required
                    maxLength="25"
                    onChange={(e) => {
                      var password = e.target.value;
                      setInput({ ...input, userPassword: password });
                      handlePasswordValidation(input.userPassword);
                    }}
                  />
                  {error && (
                    <div
                      className={`${styles.text}text-red-500 mt-2 font-medium`}
                    >
                      Şifre en az 8 karakterli, içinde büyük ve küçük harf ve
                      sayı bulundurmalıdır.
                    </div>
                  )}
                </div>
                <div>
                  <p className={`${styles.tagText} mb-2 ml-3`}>
                    Yönetici Şifresi
                  </p>
                  <input
                    className={`${styles.inputTag}`}
                    value={input.adminPassword}
                    required
                    maxLength="25"
                    onChange={(e) => {
                      var password = e.target.value;
                      setInput({ ...input, adminPassword: password });
                      handleAdminPasswordValidation(input.adminPassword);
                    }}
                  />
                  {errorAdmin && (
                    <div
                      className={`${styles.text}text-red-500 mt-2 font-medium`}
                    >
                      Şifre en az 8 karakterli, içinde büyük ve küçük harf ve
                      sayı bulundurmalıdır.
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div>
                  <p className="ml-3 mb-2">Açıklama</p>
                  <textarea
                    className={`${styles.inputTag}`}
                    value={input.note}
                    maxLength="200"
                    onChange={(e) => {
                      var string = e.target.value;
                      setInput({ ...input, note: string });
                    }}
                  />
                </div>
              </div>
              <button className={` w-fit self-end ${styles.button}`}>
                <IoMdAddCircle
                  className={` my-2  text-center ${styles.buttonIcon}`}
                />
                <p>Kaydet</p>
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="fixed bottom-0 ">
        <div
          style={{ height: "70px" }}
          className="w-screen  bg-fourth flex justify-center items-center"
        ></div>
      </div>
    </div>
  );
}

export default CreateDeviceModals;
