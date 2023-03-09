import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useParams, NavLink } from "react-router-dom";
import { Blocks } from "react-loader-spinner";

import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import DataSearchBar from "./ControlDeviceSearchBar";
import SortableTable from "../../../components/SortableTable";
import PaginationBar from "../../../components/PaginationBar";
import Syncronization from "./Syncronization";
// Icon
import { BsFillPencilFill } from "react-icons/bs";
import { TbReportAnalytics } from "react-icons/tb";
import styles from "../../../CustomStyles";
import { useGetDeviceByFirmIDQuery } from "../../../store";

function ControlDevice() {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const { id } = useParams();

  const [paginationNumber, setPaginationNumber] = useState(1);
  const [searchBar, setSearchBar] = useState(true);
  const [filteredData, setFilteredData] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [choice, setChoice] = useState(0);

  const responseDatas = useGetDeviceByFirmIDQuery({ id, token });
  const hideSearchBar = () => {
    setSearchBar(searchBar === true ? false : true);
  };

  const handleSearch = (data, isSearch) => {
    setPaginationNumber(1);
    setFilteredData(data);
    setIsSearch(isSearch);
  };
  const Datas = responseDatas.data?.data?.devices || [];

  const config = [
    {
      class: "w-4",
      label: "Detay",
      render: (data) => (
        <div className="flex flex-row justify-center">
          <NavLink to={`/Anasayfa/Cihaz/Düzenle/${data._id}/Bilgi`}>
            <button className={`${styles.tableButton}`}>
              <BsFillPencilFill className={`${styles.buttonIcon}`} />
            </button>
          </NavLink>
          <NavLink to={`/Anasayfa/Cihaz/Bilgi/${data._id}/Genel`}>
            <button className={`${styles.tableButton}`}>
              <TbReportAnalytics className={`${styles.buttonIcon}`} />
            </button>
          </NavLink>
        </div>
      ),
    },
    {
      label: "Cihaz Tipi",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Cihaz Tipi:</div>
          {data.name}
        </>
      ),
      sortValue: (data) => data.name,
    },
    {
      label: "Durum",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Durum:</div>
          {data.statusName}
        </>
      ),
      sortValue: (data) => data.statusName,
    },
    {
      label: "GSM Bilgileri",
      render: (data) => (
        <div className=" flex flex-col">
          <div className=" md:hidden opacity-40 font-Bold">GSM Bilgileri:</div>

          <div>
            <text>Ip: </text>
            {data.ip}
          </div>
          <div>
            <text>Imei: </text>
            {data.imei}
          </div>
          <div>
            <text>Serial No: </text>
            {data.serialNo}
          </div>
          <div>
            <text>Gsm No: </text>
            {data.gsmNo}
          </div>
        </div>
      ),
    },
    {
      label: "Kota Bilgileri",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Kota Bilgileri:</div>
          <div className=" flex flex-col">
            {data.productInfo.map((item) => {
              return (
                <div>
                  <text>{item.productName} Kota: </text>
                  {item.quota}
                </div>
              );
            })}
          </div>
        </>
      ),
    },
    {
      label: "Son Bağlantı",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Son Bağlantı:</div>
          {data.lastConnectionDate}
        </>
      ),
    },
    {
      label: "Durum",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Aktivite:</div>
          {data.isActive ? "Aktif" : "Pasif"}
        </>
      ),
      sortValue: (data) => data.isActive,
    },
  ];

  const keyFn = (data) => {
    return data.id;
  };

  return (
    <div className=" grid w-full">
      <div className="flex flex-col md:flex-row border-b-4 justify-between border-fourth w-full h-fit mt-10 mb-10">
        <div className=" relative flex items-center gap-3 bg-transparent mb-6 ">
          <text
            onClick={() => setChoice(0)}
            className={`${
              choice === 0 ? "text-white bg-fourth" : "text-fourth bg-white"
            } ${
              styles.DesignFieldHeader
            } transition-all duration-500 p-4 rounded-md font-SemiBold tracking-wider z-20 cursor-pointer`}
          >
            Bağlı Cihazlar
          </text>
          <text className="text-fourth z-20"> | </text>
          <text
            onClick={() => setChoice(1)}
            className={`${
              choice === 1 ? "text-white bg-fourth" : "text-fourth bg-white"
            } ${
              styles.DesignFieldHeader
            } transition-all duration-500 p-4 rounded-md font-SemiBold tracking-wider z-20 cursor-pointer`}
          >
            Cihaz Senkronizasyon
          </text>
        </div>
        <div
          className={`${
            choice === 0 ? "flex" : "hidden"
          } justify-between items-center mb-2`}
        >
          <div className="flex gap-3 items-center text-fourth">
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
        </div>
      </div>
      {responseDatas.isLoading ? (
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
      ) : responseDatas.error ||
        responseDatas?.data?.data?.devices?.length === 0 ? (
        <div className="">Cihaz bulunamadı</div>
      ) : (
        <div className=" relative overflow-hidden  w-full h-screen ">
          <div
            className={`absolute transition-all duration-700 overflow-y-scroll no-scrollbar w-full h-screen ${
              choice === 0 ? "left-0" : " -left-[124rem]"
            }`}
          >
            <div
              className={`bg-white w-full  rounded-xl shadow-xl transition-all duration-300 mb-4 ${
                searchBar ? "block p-10" : " overflow-hidden h-0"
              }`}
            >
              <DataSearchBar Data={Datas} handleSearch={handleSearch} />
            </div>
            <div className=" flex flex-col w-full gap-4 bg-white rounded-lg shadow-xl p-8 h-fit  transition-all duration-300 ">
              <div className="flex flex-col w-full items-center">
                <PaginationBar
                  elements={isSearch ? filteredData : Datas}
                  info="Bu bilgilerde bir fatura bulunamadı."
                  paginationNumber={paginationNumber}
                  setPaginationNumber={setPaginationNumber}
                />
              </div>
              <div className=" w-full ">
                <SortableTable
                  data={isSearch ? filteredData : Datas}
                  config={config}
                  keyFn={keyFn}
                  paginationNumber={paginationNumber}
                />
              </div>
            </div>
          </div>
          <div
            className={`absolute overflow-y-scroll no-scrollbar transition-all duration-700 w-full  ${
              choice === 1 ? "left-0" : " left-[124rem]"
            }`}
          >
            <Syncronization />
          </div>
        </div>
      )}
    </div>
  );
}

export default ControlDevice;
