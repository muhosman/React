import PieChartGraph from "../components/Graph/PieChartGraph";
import { useState, useEffect } from "react";
import Alerts from "./../components/Alert";

import SortableTable from "./../components/SortableTable";
import PaginationBar from "./../components/PaginationBar";
import DataSearchBar from "../components/DataSearchBar";
import { Blocks } from "react-loader-spinner";
import Confirm from "../components/Confirm";
import DropDown from "../components/DropDown";
import styles from "../CustomStyles";
import {
  useFetchDeviceServiceQuery,
  useFetchDevicesQuery,
  useUpdateFaultErrorMutation,
} from "../store";
import useAuth from "../hooks/useAuth";

function FaultErrorPage() {
  const { auth } = useAuth();
  const token = auth.accessToken;

  const responseDatas = useFetchDevicesQuery(token);
  const responseDeviceServices = useFetchDeviceServiceQuery(token);

  const DeviceServices =
    responseDeviceServices?.data?.data?.DeviceServices || [];
  const Datas = responseDatas.data?.data?.devices || [];

  const [paginationNumber, setPaginationNumber] = useState(1);
  const inputFieldName = {
    name: "Cihaz İsmi",
    ip: "IP",
  };
  const [input, setInput] = useState({
    type: "",
    info: "",
    deviceTypeID: "",
    serviceCode: "",
    solutionStep: [],
  });
  const [filteredData, setFilteredData] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  const [Update, resultUpdate] = useUpdateFaultErrorMutation();
  const [alert, setAlert] = useState(0); // 1- success 2-error 3-warning

  const [message, setMessage] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [designModel, setDesignModel] = useState(false);
  const [action, setAction] = useState(0); // 1- add 2-update 3-delete 0- default

  const error = [];
  const fault = [];

  function findAndUpdate(arr, item) {
    const foundIndex = arr.findIndex(
      (el) => el.name === item.name && el.color === item.color
    );

    if (foundIndex !== -1) {
      arr[foundIndex].value += item.value;
    } else {
      arr.push(item);
    }
  }

  Datas.forEach((device) => {
    device.errors.forEach((err) => {
      const errorItem = {
        name: err.info,
        value: err.amount,
        color: getColorByServiceCode(err.serviceCode),
      };
      findAndUpdate(error, errorItem);
    });

    device.faults.forEach((flt) => {
      const faultItem = {
        name: flt.info,
        value: flt.amount,
        color: getColorByServiceCode(flt.serviceCode),
      };
      findAndUpdate(fault, faultItem);
    });
  });

  // Helper function to get color based on serviceCode
  function getColorByServiceCode(serviceCode) {
    // You can define the mapping between serviceCode and color here
    const colorMapping = {
      400: "#004080",
      300: "#5F8D4E",
      // Add other serviceCode-color pairs as needed
    };

    return colorMapping[serviceCode] || "#000000"; // Default color if serviceCode not found in the mapping
  }

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
    handleApiResponse(resultUpdate, "Güncelleme başarılı !");
  }, [resultUpdate.isSuccess, resultUpdate.isError]);

  const handleModal = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
    setDesignModel(false);
  };
  const handleCloseModel = (boolean) => {
    if (boolean) {
      if (action === 1) {
        Update(input);
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

  const ServiceOptions = DeviceServices?.map((DeviceService) => {
    if (DeviceService.type === input.type) {
      const line =
        DeviceService.deviceSettingName +
        "-" +
        DeviceService.info +
        "-" +
        DeviceService.serviceCode;
      return {
        label: line,
        value: line,
        deviceServiceID: DeviceService._id,
        deviceSettingName: DeviceService.deviceSettingName,
      };
    }
  });

  const ServiceTypeOptions = [
    { label: "Arıza", value: "Arıza" },
    { label: "Hata", value: "Hata" },
  ];

  const handleSelectServiceType = (option) => {
    ServiceTypeOptions?.map((data) => {
      if (option.value === data.value) {
        const type = option.value === "Arıza" ? "fault" : "error";
        setInput({ ...input, type: type });
      }
    });
  };

  const handleSelectService = (option) => {
    ServiceOptions?.map((data) => {
      if (option.value === data.value) {
        setInput({
          ...input,
          line: data.value,
          deviceServiceID: data.deviceServiceID,
          deviceSettingName: data.deviceSettingName,
        });
      }
    });
  };

  const DesignModel = () => {
    return (
      <form onSubmit={handleModal} className=" flex flex-col gap-6 w-[24rem]  ">
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
            value={input.name}
            disabled
          />
        </div>
        <div className="flex flex-col gap-2 min-w-max px-8 pb-4">
          <text className={`${styles.textTitle}`}>Servis Tipi Seç:</text>
          <DropDown
            options={ServiceTypeOptions}
            value={{
              label:
                input.type === "fault"
                  ? "Arıza"
                  : input.type === "error"
                  ? "Hata"
                  : "",
              value:
                input.type === "fault"
                  ? "Arıza"
                  : input.type === "error"
                  ? "Hata"
                  : "",
            }}
            DropDownPanel={styles.DropDownPanel}
            text={styles.DropDownText}
            onChange={handleSelectServiceType}
            search={true}
            barValue={"Servis Tipi"}
          />
        </div>
        {input.type && (
          <div className="flex flex-col gap-2 min-w-max px-8 pb-4">
            <text className={`${styles.textTitle}`}>Servis Tipi Seç:</text>
            <DropDown
              options={ServiceOptions}
              value={{
                label: input.line,
                value: input.line,
              }}
              DropDownPanel={styles.DropDownPanel}
              text={styles.DropDownText}
              onChange={handleSelectService}
              search={true}
              barValue={"Servis Tipi"}
            />
          </div>
        )}

        <button
          onClick={() => {}}
          className={`${styles.buttonSearch} mb-4 w-fit self-center`}
        >
          Kaydet
        </button>
      </form>
    );
  };

  const config = [
    {
      class: "w-4",
      label: "Düzenle",
      render: (device) => (
        <div className="flex flex-row justify-center">
          <button
            onClick={() => {
              setInput({
                ...input,
                deviceId: device._id,
                name: device.name,
                type: "",
                token: token,
              });
              setDesignModel(true);
              setAction(1);
            }}
            className={`${styles.button} `}
          >
            Ekle
          </button>
        </div>
      ),
    },
    {
      label: "Cihaz Tipi",
      render: (device) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Cihaz Tipi:</div>
          {device.name}
        </>
      ),
      sortValue: (device) => device.name,
    },
    {
      label: "Firma",
      render: (device) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Firma İsmi:</div>
          {device.firmName}
        </>
      ),
      sortValue: (device) => device.firmName,
    },
    {
      label: "IP No",
      render: (device) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">IP :</div>
          {device.ip}
        </>
      ),
    },

    {
      label: "Konum",
      render: (device) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Durum:</div>
          {device.statusName}
        </>
      ),
    },
  ];

  const keyFn = (device) => {
    return device.id;
  };

  const handleSearch = (data, isSearch) => {
    setPaginationNumber(1);
    setFilteredData(data);
    setIsSearch(isSearch);
  };

  return (
    <div className="flex flex-col gap-12 w-full pr-10 mb-10  max-md:pl-10 bg-fourt">
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
      <p
        className={`${styles.DesignFieldHeader} border-b-4 border-fourth text-fourth flex gap-4 items-center pb-2`}
      >
        Arıza-Hata DASHBOARD
      </p>

      <>
        <div className={`flex flex-col gap-4 `}>
          <div className=" grid lg:grid-cols-2 grid-cols-1 gap-8 h-[32rem]">
            <div
              className={`flex flex-col gap-4 bg-white rounded-md shadow-lg shadow-fourth py-4`}
            >
              <p
                className={`${styles.DesignFieldHeader} ml-6 flex gap-4 items-center pb-2 opacity-50`}
              >
                Arıza Bilgisi
              </p>
              <div className={`h-[18rem] md:h-[24rem] w-full`}>
                {fault.length !== 0 ? (
                  <PieChartGraph data={fault} />
                ) : (
                  <div
                    className={`${styles.DesignFieldHeader} flex items-center justify-center w-full h-full`}
                  >
                    Arıza Kodu Henüz Yok !
                  </div>
                )}{" "}
              </div>
            </div>
            <div
              className={`flex flex-col gap-4 bg-white rounded-md shadow-lg shadow-fourth py-4`}
            >
              <p
                className={`${styles.DesignFieldHeader} ml-6 flex gap-4 items-center pb-2 opacity-50`}
              >
                Hata Bilgisi
              </p>
              <div className={`h-[18rem] md:h-[24rem] w-full`}>
                {error.length !== 0 ? (
                  <PieChartGraph data={error} />
                ) : (
                  <div
                    className={`${styles.DesignFieldHeader} flex items-center justify-center w-full h-full`}
                  >
                    Hata Kodu Henüz Yok !
                  </div>
                )}
              </div>
            </div>
          </div>
          {responseDatas.isFetching ? (
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
            <div className="flex flex-col relative bg-white w-full h-full rounded-lg shadow-xl mt-8">
              <p
                className={`${styles.DesignFieldHeader} absolute rounded-t-md p-4 text-white bg-fourth w-full text-center `}
              >
                Arıza | Hata Düzenleme Tablosu{" "}
              </p>

              <div className=" flex flex-col relative items-center w-full h-full shadow-lg  rounded-md p-2">
                <div
                  className={`bg-white rounded-xl shadow-lg transition-all duration-300 mb-4 w-full p-4 mt-16 `}
                >
                  <DataSearchBar
                    Data={Datas}
                    inputFieldName={inputFieldName}
                    handleSearch={handleSearch}
                  />
                </div>
                <div className=" w-full mb-16 overflow-y-scroll no-scrollbar shadow-lg mt-4">
                  <SortableTable
                    data={isSearch ? filteredData : Datas}
                    config={config}
                    keyFn={keyFn}
                    paginationNumber={paginationNumber}
                  />
                </div>

                <div className="absolute bottom-6 left-1/2">
                  <PaginationBar
                    elements={isSearch ? filteredData : Datas}
                    info="Bu bilgilerde bir cihaz bulunamadı."
                    paginationNumber={paginationNumber}
                    setPaginationNumber={setPaginationNumber}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    </div>
  );
}

export default FaultErrorPage;
