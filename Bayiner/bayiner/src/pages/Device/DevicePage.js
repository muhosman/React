import SortableTable from "../../components/SortableTable";
import PaginationBar from "../../components/PaginationBar";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { BsFillPencilFill } from "react-icons/bs";
import { TbReportAnalytics } from "react-icons/tb";
import { ImConnection } from "react-icons/im";
import { MdCoffeeMaker } from "react-icons/md";
import { BiCoffee } from "react-icons/bi";

import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import DataSearchBar from "./DeviceSearchBar";
import useAuth from "../../hooks/useAuth";

import { useFetchDevicesQuery, useUpdateQuotaMutation } from "../../store";
import { Blocks } from "react-loader-spinner";
import styles from "../../CustomStyles";

function DevicePage() {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const responseDatas = useFetchDevicesQuery(token);
  const [updateQuota, resultUpdateQuota] = useUpdateQuotaMutation();
  const Datas = responseDatas.data?.data?.devices || [];

  const [paginationNumber, setPaginationNumber] = useState(1);
  const [searchBar, setSearchBar] = useState(true);

  const [filteredData, setFilteredData] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    setIsSearch(false);
  }, []);

  useEffect(() => {
    if (resultUpdateQuota.isSuccess) {
      responseDatas.refetch(token);
    }
  }, [resultUpdateQuota]);
  const hideSearchBar = () => {
    setSearchBar(searchBar === true ? false : true);
  };

  const handleSearch = (data, isSearch) => {
    setPaginationNumber(1);
    setFilteredData(data);
    setIsSearch(isSearch);
  };

  const config = [
    {
      class: "w-4",
      label: "Düzenle",
      render: (device) => (
        <div className="flex flex-row justify-center">
          <NavLink to={`Düzenle/${device._id}/Bilgi`} forceRefresh={true}>
            <button className={`${styles.tableButton}`}>
              <BsFillPencilFill className={`${styles.buttonIcon}`} />
            </button>
          </NavLink>
          <NavLink to={`Bilgi/${device._id}/Genel`}>
            <button className={`${styles.tableButton}`} onClick={() => {}}>
              <TbReportAnalytics className={`${styles.buttonIcon}`} />
            </button>
          </NavLink>
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
      label: "GSM",
      render: (device) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold max-md:mb-2">
            Gsm Bağlantı:
          </div>
          <div className="flex md:flex-col md:justify-center items-center">
            <div className="flex md:flex-row gap-2 md:items-center text-slate-800 px-6 py-0.25 mb-1">
              <ImConnection
                className={`${
                  device.isActive
                    ? "text-green-800"
                    : "animate-pulse text-red-500"
                }  delay-200 w-6 h-6`}
              />
              <p style={{ fontSize: "0.8rem" }}>5</p>
            </div>
            <div
              className="flex md:items-center"
              style={{ fontSize: "0.6rem", lineHeight: "1rem" }}
            >
              <div>{device.lastConnectionDate}</div>
            </div>
          </div>
        </>
      ),
    },
    {
      label: "Kota Bilgileri",
      render: (device) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Kota Bilgileri:</div>
          <div className=" flex flex-col">
            {device.productInfo.map((item) => {
              return (
                <div
                  onClick={() => {
                    updateQuota({
                      token: token,
                      id: device._id,
                      quota: 5,
                      productName: item.productName,
                    });
                  }}
                  className={`${styles.button} flex flex-col mt-2`}
                >
                  <text>{item.productName}</text>
                  <div>
                    <text className="">Kota: {item.quota} </text>

                    <text>Sayaç: {item.counter}</text>
                  </div>
                </div>
              );
            })}
          </div>
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

  return (
    <div className="mr-8 max-md:ml-8 z-0">
      <div className=" w-full inline-block align-middle">
        <div className="flex max-md:flex-col my-3 gap-4  md:items-center ">
          <div className="flex gap-3 items-center text-fourth">
            <p className={`${styles.PageHeader}`}>Cihaz Listesi</p>
            <div
              className={`${styles.PageHeader} bg-slate-800 text-white px-2 rounded-full`}
            >
              {Datas.length}
            </div>
          </div>

          <div>
            <NavLink to="Oluştur" target="_self">
              <button className={`${styles.button}`}>
                <MdCoffeeMaker className={`${styles.buttonIcon}`} />
                <div className="font-SemiBold">Cihaz Ekle</div>
              </button>
            </NavLink>
          </div>
          <button className={`${styles.button} w-fit`} onClick={hideSearchBar}>
            <p className={``}>FİLTRELE</p>
            <IoIosArrowUp
              className={`${searchBar ? "flex" : "hidden"} ${
                styles.buttonIcon
              } ${styles.buttonIcon} transition-all duration-500`}
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
          <DataSearchBar Data={Datas} handleSearch={handleSearch} />
        </div>
        <div className="flex flex-col items-center gap-6 bg-white rounded-xl p-6 mb-5 overflow-hidden shadow border ">
          {responseDatas.isLoading || responseDatas.isFetching ? (
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
          ) : responseDatas.error || responseDatas?.data?.results === 0 ? (
            <div className="">Kullanıcı bulunamadı</div>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <PaginationBar
                  elements={isSearch ? filteredData : Datas}
                  info="Bu bilgilerde bir cihaz bulunamadı."
                  paginationNumber={paginationNumber}
                  setPaginationNumber={setPaginationNumber}
                />
              </div>
              <SortableTable
                data={isSearch ? filteredData : Datas}
                config={config}
                keyFn={keyFn}
                paginationNumber={paginationNumber}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DevicePage;
