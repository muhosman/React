import { useEffect, useState } from "react";
import Dropdown from "../../../components/DropDown";
import { AiOutlineWifi } from "react-icons/ai";
import { useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import Alerts from "../../../components/Alert";
import { Blocks } from "react-loader-spinner";
import Confirm from "../../../components/Confirm";

import { FaCircleNotch } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { IoMdSave } from "react-icons/io";

import {
  useFetchDeviceStatusQuery,
  useFetchFirmQuery,
  useFetchGSMQuery,
  useGetDeviceByIDQuery,
  useUpdateDeviceNoteMutation,
  useUpdateDevicePasswordMutation,
  useUpdateFirmMutation,
  useUpdateIPMutation,
  useUpdateStatusMutation,
} from "../../../store";
import styles from "../../../CustomStyles";

function UpdateInfo() {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const { id } = useParams();

  const [alert, setAlert] = useState(0); // 1- success 2-error 3-warning
  const [message, setMessage] = useState("");
  const [connection, setConnection] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [operation, setOperation] = useState(0);
  const [inputFieldName, setInputFieldName] = useState({});
  const [input, setInput] = useState([]);

  const GSM = useFetchGSMQuery(token).data?.data?.gsmInfos || "";
  const responseData = useGetDeviceByIDQuery({ token, id });
  const responseDeviceStatus = useFetchDeviceStatusQuery(token);
  const responseFirm = useFetchFirmQuery(token);

  const [updateFirm, resultUpdateFirm] = useUpdateFirmMutation();
  const [updateStatus, resultUpdateStatus] = useUpdateStatusMutation();
  const [updateIP, resultUpdateIP] = useUpdateIPMutation();
  const [updateNote, resultUpdateNote] = useUpdateDeviceNoteMutation();
  const [updatePassword, resultUpdatePassword] =
    useUpdateDevicePasswordMutation();

  const Data = responseData?.data?.data?.device || [];
  const deviceStatus = responseDeviceStatus.data?.data?.deviceStatuses || [];
  const firms = responseFirm.data?.data?.Firms || [];

  useEffect(() => {
    if (responseData.status === "fulfilled")
      setInput({ ...Data, token: token });
  }, [responseData]);

  useEffect(() => {
    if (alert !== 0) {
      setTimeout(() => {
        setAlert(0);
        setMessage("");
      }, 3000);
    }
  }, [alert]);

  const handleApiResponse = (apiResponse, successMessage) => {
    if (apiResponse.isError) {
      setAlert(2);
      setMessage("İşlem başarısız tekrar deneyin !");
      setInput((prevInput) => ({
        ...prevInput,
        token: token,
      }));
    }
    if (apiResponse.isSuccess) {
      setAlert(1);
      setMessage(successMessage);
      responseData.refetch({ token, id });
    }
  };

  useEffect(() => {
    handleApiResponse(resultUpdateFirm, "Firma güncellendi !");
  }, [resultUpdateFirm]);

  useEffect(() => {
    handleApiResponse(resultUpdateStatus, "Durum güncellendi !");
  }, [resultUpdateStatus]);

  useEffect(() => {
    handleApiResponse(resultUpdateIP, "Yeni GSM Tanımlandı !");
  }, [resultUpdateIP]);

  useEffect(() => {
    handleApiResponse(resultUpdatePassword, "Cihaz Şifresi Değiştirildi !");
  }, [resultUpdatePassword]);

  useEffect(() => {
    handleApiResponse(resultUpdateNote, "Cihaz Notları Güncellendi !");
  }, [resultUpdateNote]);

  const deviceFirmNamesOption = firms.map((firm) => {
    return { label: firm.name, value: firm.name };
  });

  const handleSelectFirm = (option) => {
    firms?.map((data) => {
      if (option.value === data.name) {
        setInput({
          ...input,
          firmID: data._id,
          firmName: data.name,
        });
      }
    });
  };

  const deviceStatusOption = deviceStatus?.map((deviceStatus) => {
    return { label: deviceStatus.name, value: deviceStatus.name };
  });

  const handleSelectStatus = (option) => {
    deviceStatus?.map((deviceStatus) => {
      if (option.value === deviceStatus.name) {
        setInput({
          ...input,
          statusName: deviceStatus.name,
        });
      }
    });
  };

  const handleCloseModel = (boolean) => {
    if (boolean) {
      if (operation === 1) {
        updateStatus(input);
      }
      if (operation === 2) {
        updateFirm(input);
      }
      if (operation === 3) {
        updatePassword(input);
      }
      if (operation === 4) {
        updateIP(input);
      }
      if (operation === 5) {
        updateNote(input);
      }
    }
    setShowConfirmModal(false);
    setOperation(0);
  };

  return (
    <div>
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

      {responseData.isFetching ? (
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
          <div className="flex flex-col md:flex-row border-b-4 border-fourth w-full mb-10">
            <p className={`${styles.DesignFieldHeader} w-full self-center `}>
              {Data.name}
            </p>
            <div className="flex items-center justify-center w-full">
              <p className={`${styles.DesignFieldHeader} w-full  `}>
                Oluşturulma Tarihi :
              </p>
              <p className={`${styles.DesignFieldHeader} w-full `}>
                {input.createdInfo}
              </p>
            </div>
            <div className="flex items-center justify-center w-full">
              <p className={`${styles.DesignFieldHeader} w-full  `}>
                Değiştirilme Tarihi :
              </p>
              <p className={`${styles.DesignFieldHeader} w-full  `}>
                {input.updatedInfo}
              </p>
            </div>
          </div>
          <div className=" grid md:grid-cols-2 grid-cols-1 gap-8 ">
            <div className=" flex flex-col gap-4 justify-between">
              <div className=" flex flex-col gap-4 bg-white rounded-lg shadow-xl p-8 h-fit">
                <p className={`${styles.tagText}`}>Durum</p>
                <Dropdown
                  options={deviceStatusOption}
                  value={{
                    label: input.statusName,
                    value: input.statusName,
                  }}
                  DropDownPanel={styles.DropDownPanel}
                  text={styles.DropDownText}
                  onChange={handleSelectStatus}
                  search={false}
                  barValue={"Durum"}
                />
                <label className="flex px-3 w-fit items-center">
                  <input
                    type="checkbox"
                    checked={input.isActive}
                    className={`${styles.InputCheckBox}`}
                    onChange={() =>
                      setInput({ ...input, isActive: !input.isActive })
                    }
                  />
                  <p className={`ml-2 ${styles.text} `}>Durum</p>
                </label>
                <button
                  onClick={() => {
                    setInputFieldName({
                      statusName: "Durum",
                    });
                    setOperation(1);
                    setShowConfirmModal(true);
                  }}
                  className={`${styles.button} w-fit self-center`}
                >
                  <IoMdSave className={`${styles.buttonIcon}`} />
                  <p className={``}>Kaydet</p>
                </button>
              </div>
              <div className=" flex flex-col gap-4 bg-white rounded-lg shadow-xl p-8 h-fit">
                <p className={` ${styles.tagText} `}>Firma</p>
                <Dropdown
                  options={deviceFirmNamesOption}
                  value={{
                    label: input.firmName,
                    value: input.firmName,
                  }}
                  DropDownPanel={styles.DropDownPanel}
                  text={styles.DropDownText}
                  onChange={handleSelectFirm}
                  search={true}
                  barValue={"Firma"}
                />
                <button
                  onClick={() => {
                    setInputFieldName({
                      firmName: "Firma İsmi",
                    });
                    setOperation(2);
                    setShowConfirmModal(true);
                  }}
                  className={`${styles.button} w-fit self-center`}
                >
                  <IoMdSave className={`${styles.buttonIcon}`} />
                  <p>Kaydet</p>
                </button>
              </div>
              <div className=" flex flex-col gap-4 bg-white rounded-lg shadow-xl p-8 h-fit">
                <div>
                  <p className={`mb-2 ${styles.tagText} `}>Kullanıcı Şifresi</p>
                  <input
                    className={`${styles.inputTag}`}
                    value={input.userPassword}
                    maxLength="25"
                    onChange={(e) => {
                      var lowerCase = e.target.value;
                      setInput({ ...input, userPassword: lowerCase });
                    }}
                  />
                </div>
                <div>
                  <p className={`mb-2 ${styles.tagText} `}>Yönetici Şifresi</p>
                  <input
                    className={`${styles.inputTag}`}
                    value={input.adminPassword}
                    maxLength="25"
                    onChange={(e) => {
                      var lowerCase = e.target.value;
                      setInput({ ...input, adminPassword: lowerCase });
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    setInputFieldName({
                      userPassword: "Kullanıcı Şifre",
                      adminPassword: "Admin Şifresi",
                    });
                    setOperation(3);
                    setShowConfirmModal(true);
                  }}
                  className={`${styles.button} w-fit self-center`}
                >
                  <IoMdSave className={`${styles.buttonIcon}`} />
                  <p>Kaydet</p>
                </button>
              </div>
            </div>
            <div className=" flex flex-col gap-4">
              <div className=" flex flex-col gap-4 bg-white rounded-lg shadow-xl p-8">
                <div className=" flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col w-full ">
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
                  </div>
                  <div className="flex flex-col justify-between ">
                    <p className={` mb-3 ${styles.tagText} `}>Seri No</p>
                    <input
                      className={`${styles.inputTag}`}
                      value={input.serialNo}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <p className={` mb-3 ${styles.tagText} `}>GSM No</p>
                    <input
                      className={`${styles.inputTag}`}
                      value={input.gsmNo}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <p className={` mb-3 ${styles.tagText} `}>Imei</p>
                    <input
                      className={`${styles.inputTag}`}
                      value={input.imei}
                      disabled
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    setInputFieldName({
                      ip: "IP",
                      gsmNo: "GSM No",
                      imei: "IMEI",
                      serialNo: "Seri No",
                    });
                    setOperation(4);
                    setShowConfirmModal(true);
                  }}
                  className={`${styles.button} w-fit self-center`}
                >
                  <IoMdSave className={`${styles.buttonIcon}`} />
                  <p>Kaydet</p>
                </button>
              </div>
              <div className=" flex flex-col gap-4 bg-white rounded-lg shadow-xl p-8 h-full">
                <div className="flex flex-col gap-2 justify-between">
                  <p className="font-SemiBold">Açıklama</p>
                  <textarea
                    className={`${styles.inputTag}`}
                    value={input.note}
                    maxLength="200"
                    onChange={(e) => {
                      var lowerCase = e.target.value;
                      setInput({
                        ...input,
                        note: lowerCase,
                      });
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    setInputFieldName({
                      note: "Açıklama",
                    });
                    setOperation(5);
                    setShowConfirmModal(true);
                  }}
                  className={`${styles.button} w-fit self-center`}
                >
                  <IoMdSave className={`${styles.buttonIcon}`} />
                  <p>Kaydet</p>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UpdateInfo;
