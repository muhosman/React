import { useState, useEffect, useRef } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";
import { BiPlusMedical } from "react-icons/bi";
import Alerts from "../../../../components/Alert";
import DropDown from "../../../../components/DropDown";
import { TbTrash, TbEdit } from "react-icons/tb";
import {
  useFetchDeviceServiceQuery,
  useAddDeviceServiceMutation,
  useDeleteDeviceServiceMutation,
  useUpdateDeviceServiceMutation,
  useFetchDeviceSettingQuery,
} from "../../../../store";
import useAuth from "../../../../hooks/useAuth";
import PaginationBar from "../../../../components/PaginationBar";
import { Blocks } from "react-loader-spinner";
import DataSearchBar from "../../../../components/DataSearchBar";
import styles from "../../../../CustomStyles";
import Confirm from "../../../../components/Confirm";

const DeviceServicePage = function () {
  const text = "";
  const { auth } = useAuth();
  const token = auth.accessToken;
  const [isSearch, setIsSearch] = useState(false);
  const inputFieldName = {
    serviceCode: "Servis Kodu",
    info: "Bilgisi",
  };
  const [input, setInput] = useState({
    type: "",
    info: "",
    deviceTypeID: "",
    serviceCode: "",
    solutionStep: [],
  });
  const [tempSolution, setTempSolution] = useState("");
  const [paginationNumber, setPaginationNumber] = useState(1);
  const [filteredData, setFilteredData] = useState("");
  const [searchBar, setSearchBar] = useState(true);

  const inputRefInfo = useRef(null);
  const inputRefSolution = useRef(null);
  const inputRefServiceCode = useRef(null);
  const inputRefDeviceTypeID = useRef(null);

  const [inputFocus, setInputFocus] = useState("info");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [designModel, setDesignModel] = useState(false);
  const [action, setAction] = useState(0); // 1- add 2-update 3-delete 0- default
  const [alert, setAlert] = useState(0); // 1- success 2-error 3-warning
  const [message, setMessage] = useState("");

  const responseDeviceService = useFetchDeviceServiceQuery(token);
  const [Update, resultUpdate] = useUpdateDeviceServiceMutation();
  const [Delete, resultDelete] = useDeleteDeviceServiceMutation();
  const [Add, resultAdd] = useAddDeviceServiceMutation();
  const responseDeviceSetting = useFetchDeviceSettingQuery(token);
  const DeviceSetting = responseDeviceSetting?.data?.data?.deviceSettings;
  const Data = responseDeviceService?.data?.data?.DeviceServices || [];

  useEffect(() => {
    setIsSearch(false);
  }, []);

  useEffect(() => {
    if (alert !== 0) {
      setTimeout(() => {
        setAlert(0);
        setMessage("");
      }, 5000);
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
    }
  };

  useEffect(() => {
    handleApiResponse(resultDelete, "Silme başarılı !");
  }, [resultDelete.isSuccess, resultAdd.isError]);
  useEffect(() => {
    handleApiResponse(resultAdd, "Ekleme başarılı !");
  }, [resultAdd.isSuccess, resultAdd.isError]);

  useEffect(() => {
    handleApiResponse(resultUpdate, "Güncelleme başarılı !");
  }, [resultUpdate.isSuccess, resultAdd.isError]);

  const hideSearchBar = () => {
    setSearchBar(searchBar === true ? false : true);
  };

  const handleChange = (event) => {
    if (event.target.name === "serviceCode") {
      if (
        event.target.value === "" ||
        event.target.value.length === 0 ||
        /^\d+$/.test(event.target.value)
      )
        setInput({ ...input, serviceCode: event.target.value });
      else event.target.value = input.serviceCode;
    } else if (event.target.name === "info") {
      setInput({
        ...input,
        info: event.target.value,
      });
    } else if (event.target.name === "solution") {
      setTempSolution(event.target.value);
    }
    setInputFocus(event.target.name);
  };

  const DeviceSettingOptions = DeviceSetting?.map((data) => {
    return { label: data.name, value: data.name };
  });
  const handleSelectDeviceSetting = (option) => {
    DeviceSetting?.map((data) => {
      if (option.value === data.name) {
        setInput({
          ...input,
          deviceSettingID: data._id,
          deviceSettingName: data.name,
        });
      }
    });
  };

  const ServiceTypeOptions = [
    { label: "fault", value: "fault" },
    { label: "error", value: "error" },
  ];
  const handleSelectServiceType = (option) => {
    ServiceTypeOptions?.map((data) => {
      if (option.value === data.value) {
        setInput({ ...input, type: option.value });
      }
    });
  };

  const handleModal = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
    setDesignModel(false);
  };

  const handleCloseModel = (boolean) => {
    if (boolean) {
      if (action === 1) {
        Add(input);
        setIsSearch(false);
      } else if (action === 2) {
        Update(input);
        setIsSearch(false);
      } else if (action === 3) {
        Delete(input);
        setIsSearch(false);
      }
      setAction(0);
      setInput("");
      setShowConfirmModal(false);
    } else {
      setShowConfirmModal(false);
      if (action === 3) setAction(0);
    }
  };

  useEffect(() => {
    if (inputRefSolution.current && inputFocus === "solution") {
      inputRefSolution.current.focus();
    }
  }, [inputRefSolution.current]);

  useEffect(() => {
    if (inputRefInfo.current && inputFocus === "info") {
      inputRefInfo.current.focus();
    }
  }, [inputRefInfo.current]);
  useEffect(() => {
    if (inputRefServiceCode.current && inputFocus === "serviceCode") {
      inputRefServiceCode.current.focus();
    }
  }, [inputRefServiceCode.current]);
  useEffect(() => {
    if (inputRefDeviceTypeID.current && inputFocus === "deviceTypeID") {
      inputRefDeviceTypeID.current.focus();
    }
  }, [inputRefDeviceTypeID.current]);

  const DesignModel = () => {
    return (
      <form onSubmit={handleModal} className=" flex flex-col gap-6 min-w-max  ">
        <div
          className={`${styles.cardTitle} text-center w-full p-4 rounded-t-xl bg-fourth text-white`}
        >
          Cihaz Servis Bilgileri
        </div>
        <div className="flex flex-col gap-2 min-w-max px-8 pb-4">
          <text className={`${styles.textTitle}`}>Servis Bilgisi:</text>
          <input
            className={` ${styles.inputTag}`}
            id="info"
            type="text"
            name="info"
            value={input.info}
            ref={inputRefInfo}
            placeholder={"Yeni Servis Bilgisi"}
            maxLength="40"
            required
            onInput={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2 min-w-max px-8 pb-4">
          <text className={`${styles.textTitle}`}>Servis Kodu:</text>
          <input
            className={` ${styles.inputTag}`}
            id="serviceCode"
            type="text"
            name="serviceCode"
            ref={inputRefServiceCode}
            value={input.serviceCode}
            placeholder={"Yeni Servis Kodu"}
            maxLength="40"
            required
            onInput={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2 min-w-max px-8 pb-4">
          <text className={`${styles.textTitle}`}>Servis Tipi Seç:</text>
          <DropDown
            options={ServiceTypeOptions}
            value={{
              label: input.type,
              value: input.type,
            }}
            DropDownPanel={styles.DropDownPanel}
            text={styles.DropDownText}
            onChange={handleSelectServiceType}
            search={true}
            barValue={"Servis Tipi"}
          />
        </div>
        <div className="flex flex-col gap-2 min-w-max px-8 pb-4">
          <text className={`${styles.textTitle}`}>Cihaz Seç:</text>
          <DropDown
            options={DeviceSettingOptions}
            value={{
              label: input.deviceSettingName,
              value: input.deviceSettingName,
            }}
            DropDownPanel={styles.DropDownPanel}
            text={styles.DropDownText}
            onChange={handleSelectDeviceSetting}
            search={true}
            barValue={"Cihaz"}
          />
        </div>
        <div className="flex flex-col gap-2 min-w-max px-8 pb-4">
          <text className={`${styles.textTitle}`}>Çözüm Adımları:</text>
          <div className=" flex gap-4">
            <input
              className={` ${styles.inputTag}`}
              id="solution"
              type="text"
              name="solution"
              ref={inputRefSolution}
              value={tempSolution}
              placeholder={"Yeni Sütun İsmi"}
              maxLength="100"
              onInput={handleChange}
            />
            <AiOutlinePlusCircle
              onClick={() => {
                if (!input.solutionStep?.includes(tempSolution)) {
                  setInput({
                    ...input,
                    solutionStep: [...input.solutionStep, tempSolution],
                  });
                }
                setTempSolution("");
              }}
              className={`${styles.buttonIcon} cursor-pointer self-center hover:text-slate-400 `}
            />
          </div>
        </div>
        <div className=" grid grid-flow-row w-full justify-center gap-4">
          {input?.solutionStep?.map((sol, index) => {
            return (
              <div className="bg-input shadow-md shadow-fourth rounded-xl p-4 relative">
                <p className=" break-all">
                  {index + 1}.Adım: {sol}
                </p>
                <span class="flex h-5 w-5 absolute -top-1 -right-1">
                  <span class="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-sky-400 opacity-75"></span>
                  <div
                    onClick={() => {
                      const updatedSolution = input?.solutionStep?.filter(
                        (Column) => Column !== sol
                      );
                      setInput({
                        ...input,
                        solutionStep: updatedSolution,
                      });
                    }}
                    className="cursor-pointer"
                  >
                    <RxCrossCircled className=" relative inline-flex rounded-full h-5 w-5 bg-sky-500 active:bg-fifth" />
                  </div>
                </span>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => {}}
          className={`${styles.buttonSearch} mb-4 w-fit self-center`}
        >
          Kaydet
        </button>
      </form>
    );
  };

  const handleSearch = (data, isSearch) => {
    setPaginationNumber(1);
    setFilteredData(data);
    setIsSearch(isSearch);
  };

  const filteredDeviceService = (isSearch ? filteredData : Data).filter(
    (Data, index) => {
      if (
        index >= paginationNumber * 10 - 10 &&
        index <= paginationNumber * 10 - 1
      )
        return Data;
    }
  );

  const content = filteredDeviceService.map((Data) => {
    return (
      <div className={`bg-white rounded-md shadow-lg`}>
        <div
          className={`text-center w-full p-4 rounded-t-xl bg-fourth text-white relative`}
        >
          <p className={`${styles.cardTitle}`}>
            {Data.type === "fault" ? "Arıza" : "Hata"} Bilgisi
          </p>
        </div>
        <div className=" p-10">
          <div className=" flex flex-col gap-4 ">
            <div>
              <text className={`${styles.textTitle}`}>Servis Bilgisi: </text>
              <text className={`${styles.text}`}>{Data.info}</text>
            </div>
            <div>
              <text className={` ${styles.textTitle}`}>Servis Kodu: </text>
              <text className={` ${styles.text}`}>{Data.serviceCode}</text>
            </div>
            <div>
              <text className={` ${styles.textTitle}`}>Cihaz İsmi: </text>
              <text className={` ${styles.text}`}>{Data.deviceTypeName}</text>
            </div>
            <div>
              <text className={`${styles.textTitle}`}>
                Oluşturulma Tarhihi:
              </text>
              <text className={` ${styles.text}`}>{Data.createdInfo}</text>
            </div>
            <div>
              <text className={` ${styles.textTitle}`}>
                Güncellenme Tarihi:
              </text>
              <text className={` ${styles.text}`}>{Data.updatedInfo}</text>s
            </div>
          </div>
        </div>
        <div className=" flex gap-4 items-center justify-center mt-6">
          <div className=" rounded-md border-2 border-fourth w-fit p-[4px]">
            <TbEdit
              onClick={() => {
                setInput({
                  ...input,
                  info: Data.info,
                  serviceCode: Data.serviceCode,
                  deviceSettingID: Data.deviceSettingID,
                  solutionStep: Data.solutionStep,
                  type: Data.type,
                  id: Data._id,
                  token: token,
                });
                setDesignModel(true);
                setAction(2);
              }}
              className=" w-8 h-8 rounded-md border-2 hover:text-slate-400 hover:border-slate-400 text-fourth border-fourth cursor-pointer"
            />
          </div>
          <div className="rounded-md border-2 border-fourth w-fit p-[4px]">
            <TbTrash
              onClick={() => {
                setInput({
                  ...input,
                  info: Data.info,
                  serviceCode: Data.serviceCode,
                  deviceSettingID: Data.deviceSettingID,
                  id: Data._id,
                  token: token,
                });
                setShowConfirmModal(true);
                setAction(3);
              }}
              className=" w-8 h-8 rounded-md border-2 hover:text-slate-400 hover:border-slate-400 text-fourth border-fourth cursor-pointer"
            />
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className={` mb-20 flex flex-col md:mr-10 md:ml-0 mx-10`}>
      {alert !== 0 && (
        <div
          className="fixed z-10 left-1/2 top-0
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
      <div className=" w-full flex flex-col gap-4">
        <div className="flex max-md:flex-col gap-3 md:items-center text-fourth w-fit">
          <div className=" flex gap-2">
            <div className={`${styles.PageHeader}`}>Durum Listesi</div>
            <div
              className={`${styles.PageHeader}  bg-fourth text-white px-2 rounded-full`}
            >
              {Data.length}
            </div>
          </div>
          <div
            onClick={() => {
              setAction(1);
              setInput({
                ...input,
                token: token,
                info: "",
                serviceCode: "",
                deviceTypeID: "",
              });
              setDesignModel(true);
            }}
            className={`${styles.button}`}
          >
            <p className=" font-SemiBold">Ekle</p>
            <BiPlusMedical className={`${styles.buttonIcon} `} />
          </div>
          <button className={`${styles.button}`} onClick={hideSearchBar}>
            <p className={``}>FİLTRELE</p>
            <IoIosArrowUp
              className={`${searchBar ? "flex" : "hidden"} ${
                styles.buttonIcon
              } transition-all duration-500`}
            />
            <IoIosArrowDown
              className={`${searchBar ? "hidden" : "flex"} ${
                styles.buttonIcon
              } transition-all duration-500`}
            />
          </button>
        </div>
        <div
          className={`bg-white rounded-xl shadow transition-all duration-300 mb-4 ${
            searchBar ? "block p-10" : " overflow-hidden h-0"
          }`}
        >
          <DataSearchBar
            Data={Data}
            handleSearch={handleSearch}
            isSearch={isSearch}
            inputFieldName={inputFieldName}
          />
        </div>

        {responseDeviceService.isFetching ? (
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
        ) : responseDeviceService.error ||
          responseDeviceService?.data?.results === 0 ? (
          <div className=" text-SemiBold">Cihaz bulunamadı</div>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <PaginationBar
                elements={isSearch ? filteredData : Data}
                info="Bu bilgilerde bir cihaz bulunamadı."
                paginationNumber={paginationNumber}
                setPaginationNumber={setPaginationNumber}
              />
            </div>
            <div className=" grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-8 mt-6 z-0 ">
              <>{content}</>
            </div>
          </>
        )}

        {designModel && (
          <div>
            <div
              onClick={() => {
                setInput("");
                setShowConfirmModal(false);
                setDesignModel(false);
                setAction(0);
              }}
              className="fixed inset-0 z-40 bg-gray-300 opacity-80 "
            ></div>
            <div
              className={`fixed z-50 top-1/2 left-1/2 -translate-y-1/2 overflow-y-scroll no-scrollbar rounded-xl -translate-x-1/2  w-fit max-h-[41rem]`}
            >
              <div
                className=" bg-white flex flex-col justify-center rounded-xl
          items-center w-fit h-fit"
              >
                {designModel && <DesignModel />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceServicePage;
