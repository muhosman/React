import { useState, useEffect, useRef } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { AiOutlinePlusCircle } from "react-icons/ai";
import DropDown from "../../../../components/DropDown";
import { RxCrossCircled } from "react-icons/rx";
import { BiPlusMedical } from "react-icons/bi";
import Alerts from "../../../../components/Alert";
import { TbTrash, TbEdit } from "react-icons/tb";
import {
  useFetchDeviceSettingQuery,
  useAddDeviceSettingMutation,
  useDeleteDeviceSettingMutation,
  useUpdateDeviceSettingMutation,
  useFetchProductTypeQuery,
} from "../../../../store";
import useAuth from "../../../../hooks/useAuth";
import PaginationBar from "../../../../components/PaginationBar";
import { Blocks } from "react-loader-spinner";
import DataSearchBar from "./SettingSearchBar";
import styles from "../../../../CustomStyles";
import Confirm from "../../../../components/Confirm";

const DeviceSettingPage = function () {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const [isSearch, setIsSearch] = useState(false);
  const [input, setInput] = useState("");
  const [tempCup, setTempCup] = useState("");
  const [tempGeneral, setTempGeneral] = useState("");

  const [paginationNumber, setPaginationNumber] = useState(1);
  const [filteredData, setFilteredData] = useState("");
  const [searchBar, setSearchBar] = useState(true);

  const inputRefName = useRef(null);
  const inputRefQuota = useRef(null);
  const inputRefQuotaWarning = useRef(null);
  const inputRefQuotaMax = useRef(null);
  const inputRefPrice = useRef(null);
  const inputRefSyncLevel = useRef(null);

  const inputRefCup = useRef(null);
  const inputRefGneral = useRef(null);
  const [inputFocus, setInputFocus] = useState("");
  const [inputFieldName, setInputFieldName] = useState({});

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [designModel, setDesignModel] = useState(false);
  const [action, setAction] = useState(0); // 1- add 2-update 3-delete 0- default
  const [alert, setAlert] = useState(0); // 1- success 2-error 3-warning
  const [message, setMessage] = useState("");

  const ProductTypeResult = useFetchProductTypeQuery(token);
  const responseDeviceSetting = useFetchDeviceSettingQuery(token);
  const [Update, resultUpdate] = useUpdateDeviceSettingMutation();
  const [Delete, resultDelete] = useDeleteDeviceSettingMutation();
  const [Add, resultAdd] = useAddDeviceSettingMutation();

  const DeviceSetting = responseDeviceSetting?.data?.data?.deviceSettings || [];
  const ProductType = ProductTypeResult?.data?.data?.productTypes || [];
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
    setInputFieldName({
      name: "Ayar İsmi",
      productName: "Kullanılacak Ürün İsmi",
      quota: "Başlangıç Kota",
      quotaMax: "Başlangıç Maximum Kota",
      quotaWarning: "Başlangıç Tehlikeli Kota",
    });
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
    if (event.target.name === "general") {
      setTempCup(event.target.value);
    } else if (event.target.name === "cup") {
      setTempGeneral(event.target.value);
    } else {
      setInput({
        ...input,
        [event.target.name]: event.target.value,
      });
    }
    setInputFocus(event.target.name);
  };

  useEffect(() => {
    if (inputRefName.current && inputFocus === "name") {
      inputRefName.current.focus();
    }
  }, [inputRefName.current]);
  useEffect(() => {
    if (inputRefQuota.current && inputFocus === "quota") {
      inputRefQuota.current.focus();
    }
  }, [inputRefQuota.current]);
  useEffect(() => {
    if (inputRefQuotaMax.current && inputFocus === "quotaMax") {
      inputRefQuotaMax.current.focus();
    }
  }, [inputRefQuotaMax.current]);
  useEffect(() => {
    if (inputRefQuotaWarning.current && inputFocus === "quotaWarning") {
      inputRefQuotaWarning.current.focus();
    }
  }, [inputRefQuotaWarning.current]);
  useEffect(() => {
    if (inputRefPrice.current && inputFocus === "price") {
      inputRefPrice.current.focus();
    }
  }, [inputRefPrice.current]);
  useEffect(() => {
    if (inputRefSyncLevel.current && inputFocus === "syncLevel") {
      inputRefSyncLevel.current.focus();
    }
  }, [inputRefSyncLevel.current]);
  useEffect(() => {
    if (inputRefCup.current && inputFocus === "general") {
      inputRefCup.current.focus();
    }
  }, [inputRefCup.current]);
  useEffect(() => {
    if (inputRefGneral.current && inputFocus === "cup") {
      inputRefGneral.current.focus();
    }
  }, [inputRefGneral.current]);

  const productTypeOptions = ProductType?.map((data) => {
    return { label: data.name, value: data.name };
  });
  const handleSelectProductType = (option) => {
    ProductType?.map((data) => {
      if (option.value === data.name) {
        setInput({
          ...input,
          productName: data.name,
        });
      }
    });
  };

  const DesignModel = () => {
    return (
      <form
        onSubmit={handleModal}
        className=" flex flex-col gap-6 min-w-max relative "
      >
        <div
          className={`${styles.cardTitle} text-center w-full p-4 rounded-t-xl bg-fourth text-white`}
        >
          Cihaz Ayar Bilgisi
        </div>
        <div className="flex flex-col gap-2 min-w-max px-8 pb-4">
          <text className={`${styles.textTitle}`}>Ayar İsmi:</text>
          <input
            className={` ${styles.inputTag}`}
            id="name"
            type="text"
            name="name"
            value={input.name}
            ref={inputRefName}
            placeholder={"Yeni Cihaz İsmi"}
            maxLength="40"
            required
            onInput={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2 min-w-max px-8 pb-4">
          <text className={`${styles.textTitle}`}>Ürün Tipi:</text>
          <DropDown
            options={productTypeOptions}
            value={{
              label: input.productName,
              value: input.productName,
            }}
            DropDownPanel={styles.DropDownPanel}
            text={styles.DropDownText}
            onChange={handleSelectProductType}
            maxLength="40"
            search={true}
            barValue={"Ürün Tipi"}
          />
        </div>
        <div className="flex flex-col gap-2 min-w-max px-8 pb-4">
          <text className={`${styles.textTitle}`}>
            Oluşturma Kota Seviyesi:
          </text>
          <input
            className={` ${styles.inputTag}`}
            id="quota"
            type="number"
            name="quota"
            ref={inputRefQuota}
            value={input.quota}
            placeholder={"Min-0 Max-200"}
            min="0"
            max="200"
            maxLength="3"
            required
            onInput={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2 min-w-max px-8 pb-4">
          <text className={`${styles.textTitle}`}>
            Oluşturma Tehlikeli Kota Seviyesi:
          </text>
          <input
            className={` ${styles.inputTag}`}
            id="quotaWarning"
            type="number"
            name="quotaWarning"
            ref={inputRefQuotaWarning}
            value={input.quotaWarning}
            placeholder={"Min-100 Max-1000"}
            min="100"
            max="1000"
            required
            onInput={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2 min-w-max px-8 pb-4">
          <text className={`${styles.textTitle}`}>
            Oluşturma Maximum Kota Seviyesi:
          </text>
          <input
            className={` ${styles.inputTag}`}
            id="quotaMax"
            type="number"
            name="quotaMax"
            ref={inputRefQuotaMax}
            value={input.quotaMax}
            placeholder={"Min-1000 Max-20000"}
            min="1000"
            max="20000"
            required
            onInput={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2 min-w-max px-8 pb-4">
          <text className={`${styles.textTitle}`}>
            Oluşturma Ürün Birim Fiyat:
          </text>
          <input
            className={` ${styles.inputTag}`}
            id="price"
            type="number"
            name="price"
            ref={inputRefPrice}
            value={input.price}
            placeholder={"Min-0.5 Max-1000"}
            min="0.1"
            max="100"
            step="0.01"
            required
            onInput={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2 min-w-max px-8 pb-4">
          <text className={`${styles.textTitle}`}>
            Oluşturma Senkronizasyon Seviyesi:
          </text>
          <input
            className={` ${styles.inputTag}`}
            id="syncLevel"
            type="number"
            name="syncLevel"
            ref={inputRefSyncLevel}
            value={input.syncLevel}
            placeholder={"Min-50 Max-1000"}
            min="50"
            max="1000"
            required
            onInput={handleChange}
          />
        </div>
        <div
          className={`${styles.cardTitle} text-center w-full p-4  bg-fourth text-white`}
        >
          Cihaz Ayarları
        </div>
        <div className="flex flex-col gap-2 min-w-max px-8 pb-4">
          <text className={`${styles.textTitle}`}>Genel Ayar İsimleri:</text>
          <div className=" flex gap-4">
            <input
              className={` ${styles.inputTag}`}
              id="general"
              type="text"
              name="general"
              ref={inputRefCup}
              value={tempCup}
              placeholder={"Genel Ayar İsmi"}
              maxLength="25"
              onInput={handleChange}
            />
            <AiOutlinePlusCircle
              onClick={() => {
                if (!input.cupSettingRow.includes(tempCup)) {
                  setInput({
                    ...input,
                    cupSettingRow: [...input.cupSettingRow, tempCup],
                  });
                }
                setTempCup("");
              }}
              className={` ${styles.buttonIcon} cursor-pointer content-center self-center hover:text-slate-400`}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 min-w-max px-8 pb-4">
          {input.cupSettingRow?.map((cup) => {
            return (
              <div className="bg-input rounded-xl p-2 text-center relative w-fit">
                <p className=" break-words pt-2">{cup}</p>
                <span class="flex h-5 w-5 absolute -top-1 -right-1">
                  <span class="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-sky-400 opacity-75"></span>
                  <div
                    onClick={() => {
                      const updatedSettingsColumn = input.cupSettingRow.filter(
                        (Cup) => Cup !== cup
                      );
                      setInput({
                        ...input,
                        cupSettingRow: updatedSettingsColumn,
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
        <div className="flex flex-col gap-2 min-w-max px-8 pb-4">
          <text className={`${styles.textTitle}`}>Fincan Ayar İsimleri:</text>
          <div className=" flex gap-4">
            <input
              className={` ${styles.inputTag}`}
              id="cup"
              type="text"
              name="cup"
              ref={inputRefGneral}
              value={tempGeneral}
              placeholder={"Fincan Ayarı"}
              maxLength="25"
              onInput={handleChange}
            />
            <AiOutlinePlusCircle
              onClick={() => {
                if (!input.generalSettingRow.includes(tempGeneral)) {
                  setInput({
                    ...input,
                    generalSettingRow: [
                      ...input.generalSettingRow,
                      tempGeneral,
                    ],
                  });
                }
                setTempGeneral("");
              }}
              className={` ${styles.buttonIcon} cursor-pointer content-center self-center hover:text-slate-400`}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 min-w-max px-8 pb-4">
          {input.generalSettingRow.map((general) => {
            return (
              <div className="bg-input rounded-xl p-2 text-center relative  w-fit">
                <p className=" break-words pt-2">{general}</p>
                <span class="flex h-5 w-5 absolute -top-1 -right-1">
                  <span class="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-sky-400 opacity-75"></span>
                  <div
                    onClick={() => {
                      const updatedSettingsRow = input.generalSettingRow.filter(
                        (Row) => Row !== general
                      );
                      setInput({
                        ...input,
                        generalSettingRow: updatedSettingsRow,
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
  const filteredDeviceSetting = (
    isSearch ? filteredData : DeviceSetting
  )?.filter((DeviceSetting, index) => {
    if (
      index >= paginationNumber * 10 - 10 &&
      index <= paginationNumber * 10 - 1
    )
      return DeviceSetting;
  });
  const content = filteredDeviceSetting?.map((DeviceSetting) => {
    return (
      <div className={`bg-white rounded-md shadow-lg`}>
        <div
          className={`text-center w-full p-4 rounded-t-xl bg-fourth text-white relative`}
        >
          <p className={`${styles.cardTitle}`}>
            Tanımlanmış Cihaz Ayar Bilgisi
          </p>
        </div>

        <div className=" p-10 ">
          <div className=" flex flex-col gap-4">
            <div>
              <text className={` ${styles.textTitle}`}>Ayar İsmi: </text>
              <text className={`${styles.text}`}>{DeviceSetting.name}</text>
            </div>
            <div>
              <text className={` ${styles.textTitle}`}>
                Kullanılacak Ürün İsmi:{" "}
              </text>
              <text className={`${styles.text}`}>
                {DeviceSetting.productName}
              </text>
            </div>
            <div>
              <text className={` ${styles.textTitle}`}>Oluşturma Kotası: </text>
              <text className={`${styles.text}`}>{DeviceSetting.quota}</text>
            </div>
            <div>
              <text className={` ${styles.textTitle}`}>
                Oluşturma Kota Tehlike Seviyesi:
              </text>
              <text className={`${styles.text}`}>
                {DeviceSetting.quotaWarning}
              </text>
            </div>
            <div>
              <text className={` ${styles.textTitle}`}>
                Oluşturma Kota Maximum Seviyesi:
              </text>
              <text className={`${styles.text}`}>{DeviceSetting.quotaMax}</text>
            </div>
            <div>
              <text className={` ${styles.textTitle}`}>
                Oluşturma Senkronizasyon Seviyesi:
              </text>
              <text className={`${styles.text}`}>
                {DeviceSetting.syncLevel}
              </text>
            </div>
            <div className=" flex flex-col gap-3">
              <text className={` ${styles.textTitle}`}>Genel Ayarlar:</text>
              <div className=" grid sm:grid-cols-3 grid-cols-2 gap-3 text-fourth">
                {DeviceSetting.generalSettingRow.map((rowSet) => {
                  return (
                    <div className=" bg-input rounded-xl px-3 self-center w-fit">
                      <p className={`${styles.text}`}>{rowSet}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className=" flex flex-col gap-3 text-black">
              <text className=" text-black font-Bold">Fincan Ayarları:</text>
              <div className=" grid sm:grid-cols-3 grid-cols-2  gap-3 text-fourth">
                {DeviceSetting.cupSettingRow.map((colSet) => {
                  return (
                    <div className=" bg-input rounded-xl px-3 w-fit h-fit self-center">
                      <text className={`${styles.text}`}>{colSet}</text>
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
                    name: DeviceSetting.name,
                    productName: DeviceSetting.productName,
                    quota: DeviceSetting.quota,
                    quotaWarning: DeviceSetting.quotaWarning,
                    quotaMax: DeviceSetting.quotaMax,
                    price: DeviceSetting.price,
                    syncLevel: DeviceSetting.syncLevel,
                    id: DeviceSetting._id,
                    token: token,
                    cupSettingRow: DeviceSetting.cupSettingRow,
                    generalSettingRow: DeviceSetting.generalSettingRow,
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
                    name: DeviceSetting.name,
                    productName: DeviceSetting.productName,
                    quota: DeviceSetting.quota,
                    quotaWarning: DeviceSetting.quotaWarning,
                    quotaMax: DeviceSetting.quotaMax,
                    price: DeviceSetting.price,
                    syncLevel: DeviceSetting.syncLevel,
                    id: DeviceSetting._id,
                    token: token,
                    cupSettingRow: DeviceSetting.cupSettingRow,
                    generalSettingRow: DeviceSetting.generalSettingRow,
                  });
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
            <div className={`${styles.PageHeader}`}>Cihaz Ayar Listesi</div>
            <div
              className={`${styles.PageHeader}  bg-fourth text-white px-2 rounded-full`}
            >
              {DeviceSetting.length}
            </div>
          </div>

          <div
            onClick={() => {
              setTempCup("");
              setTempGeneral("");
              setInput({
                cupSettingRow: [],
                generalSettingRow: [],
                token: token,
              });
              setDesignModel(true);
              setAction(1);
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

      {responseDeviceSetting.isFetching ? (
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
      ) : responseDeviceSetting.error ||
        responseDeviceSetting.data?.results === 0 ? (
        <div className=" text-SemiBold">Cihaz Ayarları bulunamadı </div>
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

export default DeviceSettingPage;
