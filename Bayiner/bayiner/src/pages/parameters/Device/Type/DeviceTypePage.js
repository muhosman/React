import { useState, useEffect, useRef } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import DropDown from "../../../../components/DropDown";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";
import { BiPlusMedical } from "react-icons/bi";
import Alerts from "../../../../components/Alert";
import { TbTrash, TbEdit } from "react-icons/tb";
import {
  useFetchDeviceTypeQuery,
  useAddDeviceTypeMutation,
  useDeleteDeviceTypeMutation,
  useUpdateDeviceTypeMutation,
  useFetchDeviceSettingQuery,
} from "../../../../store";
import useAuth from "../../../../hooks/useAuth";
import PaginationBar from "../../../../components/PaginationBar";
import { Blocks } from "react-loader-spinner";
import DataSearchBar from "./TypeSearchBar";
import styles from "../../../../CustomStyles";
import Confirm from "../../../../components/Confirm";

const DeviceTypePage = function () {
  const text = "";
  const infoTitle = "";

  const { auth } = useAuth();
  const token = auth.accessToken;
  const [isSearch, setIsSearch] = useState(false);
  const [input, setInput] = useState({
    name: "",
    settingType: [],
  });

  const [cupNumber, setCupNumber] = useState("");
  const [settingID, setSettingID] = useState("");
  const [settingName, setSettingName] = useState("");

  const [paginationNumber, setPaginationNumber] = useState(1);
  const [filteredData, setFilteredData] = useState("");
  const [searchBar, setSearchBar] = useState(true);
  const inputRefName = useRef(null);
  const inputRefCup = useRef(null);
  const [inputFocus, setInputFocus] = useState("name");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [designModel, setDesignModel] = useState(false);
  const [action, setAction] = useState(0); // 1- add 2-update 3-delete 0- default
  const [alert, setAlert] = useState(0); // 1- success 2-error 3-warning
  const [message, setMessage] = useState("");
  const [inputFieldName, setInputFieldName] = useState({});

  const responseDeviceSetting = useFetchDeviceSettingQuery(token);
  const responseDeviceType = useFetchDeviceTypeQuery(token);

  const [Update, resultUpdate] = useUpdateDeviceTypeMutation();
  const [Delete, resultDelete] = useDeleteDeviceTypeMutation();
  const [Add, resultAdd] = useAddDeviceTypeMutation();

  const DeviceType = responseDeviceType?.data?.data?.deviceTypes || [];
  const DeviceSetting = responseDeviceSetting?.data?.data?.deviceSettings || [];
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
  const handleModal = (e) => {
    e.preventDefault();
    setInputFieldName({ name: "Cihaz İsmi" });
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

  const handleChange = (event) => {
    if (event.target.name === "name") {
      setInput({
        ...input,
        name: event.target.value,
      });
    } else if (event.target.name === "Cup") {
      setCupNumber(event.target.value);
    }
    setInputFocus(event.target.name);
  };

  useEffect(() => {
    if (inputRefName.current && inputFocus === "name") {
      inputRefName.current.focus();
    }
  }, [inputRefName.current]);
  useEffect(() => {
    if (inputRefCup.current && inputFocus === "Cup") {
      inputRefCup.current.focus();
    }
  }, [inputRefCup.current]);

  const settingOptions = DeviceSetting?.map((data) => {
    return { label: data.name, value: data.name };
  });
  const handleSelectSetting = (option) => {
    DeviceSetting?.map((data) => {
      if (option.value === data.name) {
        setSettingID(data._id);
        setSettingName(data.name);
      }
    });
  };

  const DesignModel = () => {
    return (
      <form
        onSubmit={handleModal}
        className=" flex flex-col gap-6 min-w-max h-fit "
      >
        <div
          className={`${styles.cardTitle} text-center w-full p-4 rounded-t-xl bg-fourth text-white`}
        >
          Cihaz Tipi Bilgileri
        </div>
        <div className="flex flex-col gap-2 min-w-max px-8 pb-4">
          <text className={`${styles.textTitle}`}>Cihaz İsmi:</text>
          <input
            className={` ${styles.inputTag}`}
            id="name"
            type="text"
            name="name"
            value={input.name}
            ref={inputRefName}
            placeholder={"Yeni Cihaz İsmi"}
            maxLength="25"
            required
            onInput={handleChange}
          />
        </div>
        <div
          className={`${styles.cardTitle} text-center w-full p-4  bg-fourth text-white`}
        >
          Cihaz Ayarı
        </div>
        <div className=" flex items-center justify-center w-full gap-4 px-6">
          <div className=" flex flex-col w-full gap-3 justify-between">
            <p className={`${styles.textTitle}`}>Göz Sayısı</p>
            <div className=" flex self">
              <input
                className={` ${styles.inputTag}`}
                id="Cup"
                type="text"
                name="Cup"
                ref={inputRefCup}
                value={cupNumber}
                placeholder={"Yeni Göz Sayısı"}
                maxLength="25"
                onInput={handleChange}
              />
            </div>
          </div>
          <div className=" flex flex-col w-full gap-3 justify-between">
            <text className={`${styles.textTitle}`}>Ayar Tipi Seç</text>
            <div className=" flex justify-between items-center gap-2">
              <div className="w-full z-30">
                <DropDown
                  options={settingOptions}
                  value={{
                    label: settingName,
                    value: settingName,
                  }}
                  DropDownPanel={styles.DropDownPanel}
                  text={styles.DropDownText}
                  onChange={handleSelectSetting}
                  search={true}
                  barValue={"Ürün Tipi"}
                />
              </div>

              <AiOutlinePlusCircle
                onClick={() => {
                  if (
                    !input?.settingType.find((set) => {
                      return set.settingID === settingID;
                    }) &&
                    cupNumber.length !== 0
                  ) {
                    setInput({
                      ...input,
                      settingType: [
                        ...input.settingType,
                        { cupNumber: cupNumber, settingID: settingID },
                      ],
                    });
                  }
                  console.log(input);
                  setCupNumber("");
                  setSettingID("");
                }}
                className={`${styles.buttonIcon} text-fourth hover:text-slate-400 cursor-pointer`}
              />
            </div>
          </div>
        </div>
        <div className=" grid grid-cols-1 gap-2  self-center">
          {input?.settingType?.map((set) => {
            return (
              <div className="bg-input rounded-xl p-2 relative">
                <p className=" break-all">Göz Sayısı:{set.cupNumber}</p>
                <p className=" break-all">
                  Ayar İsmi:
                  {DeviceSetting?.map((Dev) => {
                    if (Dev._id === set.settingID) return Dev.name;
                  })}
                </p>
                <span class="flex h-5 w-5 absolute -top-1 -right-1">
                  <span class="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-sky-400 opacity-75"></span>
                  <div
                    onClick={() => {
                      const updatedSetting = input?.settingType?.filter(
                        (Set) => Set.settingID !== set.settingID
                      );
                      setInput({
                        ...input,
                        settingType: updatedSetting,
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
          className={`${styles.buttonSearch}  
          px-6 py-3 w-fit self-center mb-2`}
        >
          Kaydet
        </button>
      </form>
    );
  };

  const filteredDeviceType = (isSearch ? filteredData : DeviceType).filter(
    (DeviceType, index) => {
      if (
        index >= paginationNumber * 10 - 10 &&
        index <= paginationNumber * 10 - 1
      )
        return DeviceType;
    }
  );

  const content = filteredDeviceType.map((DeviceType) => {
    return (
      <div className={`bg-white rounded-md shadow-lg`}>
        <div
          className={`text-center w-full p-4 rounded-t-xl bg-fourth text-white relative`}
        >
          <p className={`${styles.cardTitle}`}>Cihaz Tipi</p>
        </div>
        <div className=" p-10 ">
          <div className=" flex flex-col gap-4">
            <div>
              <text className={`${styles.textTitle}`}>Tip İsmi: </text>
              <text className={`${styles.text}`}>{DeviceType.name}</text>
            </div>

            <div className=" flex flex-col gap-3 text-black">
              <text className=" text-black font-Bold">Cihaz Ayarları:</text>
              <div className=" grid sm:grid-cols-2 grid-cols-1  gap-3 text-fourth">
                {DeviceType?.settingType?.map((Set) => {
                  return (
                    <div className=" bg-input rounded-xl px-3 w-fit h-fit self-center">
                      <div className=" bg-input rounded-xl p-4 flex flex-col gap-2">
                        <p>
                          <text className={`${styles.textTitle}`}>
                            Göz Sayısı:
                          </text>
                          <text className={`${styles.text}`}>
                            {Set.cupNumber}
                          </text>
                        </p>
                        <p>
                          <text className={`${styles.textTitle}`}>
                            Ayar Tipi:
                          </text>
                          <text className={`${styles.text}`}>
                            {DeviceSetting?.map((Dev) => {
                              if (Dev._id === Set.settingID) return Dev.name;
                            })}
                          </text>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className=" flex gap-4 items-center justify-center mt-6">
            <div className=" rounded-md border-2 border-fourth w-fit p-[4px]">
              <TbEdit
                onClick={() => {
                  setInput({
                    ...input,
                    id: DeviceType._id,
                    token: token,
                    name: DeviceType.name,
                    settingType: DeviceType.settingType,
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
                    id: DeviceType._id,
                    token: token,
                    name: DeviceType.name,
                    settingType: DeviceType.settingType,
                  });
                  setCupNumber("");
                  setSettingID("");
                  setShowConfirmModal(true);
                  setAction(3);
                }}
                className=" w-8 h-8 rounded-md border-2 hover:text-slate-400 hover:border-slate-400 text-fourth border-fourth cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    );
  });

  const handleSearch = (data, isSearch) => {
    setPaginationNumber(1);
    setFilteredData(data);
    setIsSearch(isSearch);
  };

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
            <div className={`${styles.PageHeader}`}>Cihaz Tipi Listesi</div>
            <div
              className={`${styles.PageHeader}  bg-fourth text-white px-2 rounded-full`}
            >
              {DeviceType.length}
            </div>
          </div>

          <div
            onClick={() => {
              setAction(1);
              setCupNumber("");
              setSettingID("");
              setInput({
                ...input,
                token: token,
                name: "",
                settingType: [],
              });
              setDesignModel(true);
            }}
            className={`${styles.button} w-fit`}
          >
            <p className=" font-SemiBold">Ekle</p>
            <BiPlusMedical className={`${styles.buttonIcon} `} />
          </div>
          <button className={`${styles.button} w-fit`} onClick={hideSearchBar}>
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
          <DataSearchBar Data={DeviceSetting} handleSearch={handleSearch} />
        </div>
      </div>

      {responseDeviceType.isFetching ? (
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
      ) : responseDeviceType.error || responseDeviceType.data?.results === 0 ? (
        <div className=" text-SemiBold">Cihaz Tipleri bulunamadı !</div>
      ) : (
        <>
          <div className="flex flex-col items-center">
            <PaginationBar
              elements={isSearch ? filteredData : DeviceSetting}
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
        <>
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
        </>
      )}
    </div>
  );
};

export default DeviceTypePage;
