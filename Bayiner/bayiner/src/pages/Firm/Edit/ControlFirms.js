import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useParams, NavLink } from "react-router-dom";

import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import DataSearchBar from "./ControlFirmSearchBar";
import SortableTable from "../../../components/SortableTable";
import PaginationBar from "../../../components/PaginationBar";
// Icon
import { BsFillPencilFill } from "react-icons/bs";
import { TbReportAnalytics } from "react-icons/tb";
import { useGetBelowFirmsByIDQuery } from "../../../store";
import { Blocks } from "react-loader-spinner";

function ControlFirm() {
  const button =
    "xl:text-XL md:text-BASE text-SM items-center gap-4 text-white flex bg-fourth rounded-md px-4 py-2 transition-all duration-300 active:scale-90";
  const buttonIcon = "xl:w-8 xl:h-8 md:w-7 md:h-7 w-6 h-6";
  const tableButton = " text-fourth hover:text-gray-400";

  const { id } = useParams();
  const { auth } = useAuth();
  const token = auth.accessToken;
  const [paginationNumber, setPaginationNumber] = useState(1);
  const [searchBar, setSearchBar] = useState(true);
  const [filteredData, setFilteredData] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const resultBelowFirms = useGetBelowFirmsByIDQuery({ id, token });
  const Datas = resultBelowFirms?.data?.data?.firms || [];

  const hideSearchBar = () => {
    setSearchBar(searchBar === true ? false : true);
  };
  useEffect(() => {
    setIsSearch(false);
  }, []);
  const handleSearch = (data, isSearch) => {
    setPaginationNumber(1);
    setFilteredData(data);
    setIsSearch(isSearch);
  };

  const config = [
    {
      class: "w-4",
      label: "Detay",
      render: (data) => (
        <div className="flex flex-row justify-center">
          <NavLink to={`/Anasayfa/Firma/Düzenle/${data._id}/Bilgi`}>
            <button
              className={`flex items-center justify-center py-2 pl-4 pr-3 rounded-full transition duration-500 ${tableButton} `}
            >
              <BsFillPencilFill
                className={`2xl:w-10 2xl:h-10 w-7 h-7 ${buttonIcon}`}
              />
            </button>
          </NavLink>

          <NavLink to={`/Anasayfa/Firma/Bilgi/${data._id}/Genel`}>
            <button
              className={`flex items-center justify-center py-2 pl-4 pr-3 rounded-full transition duration-500 ${tableButton} `}
            >
              <TbReportAnalytics
                className={`2xl:w-10 2xl:h-10 w-7 h-7 ${buttonIcon}`}
              />
            </button>
          </NavLink>
        </div>
      ),
    },
    {
      label: " Bayser No",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Bayser No:</div>
          {data.bayserNo}
        </>
      ),
      sortValue: (data) => data.bayserNo,
    },
    {
      label: " Firma İsmi",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Firma:</div>
          {data.name}
        </>
      ),
      sortValue: (data) => data.name,
    },
    {
      label: "İletişim",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">İletişim:</div>
          <div className=" flex flex-col">
            <div>
              <text>Email: </text>
              {data.email}
            </div>
            <div>
              <text>Telefon: </text>
              {data.tel}
            </div>
          </div>
        </>
      ),
    },
    {
      label: "Adres",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Adres:</div>

          <div className=" flex flex-col">
            <div>
              <text>İl: </text>
              {data.address.city}
            </div>
            <div>
              <text>İlçe: </text>
              {data.address.town}
            </div>
          </div>
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
      <div className="flex flex-col md:flex-row border-b-4 border-fourth w-full h-fit mb-4">
        <text className="flex items-center font-SemiBold tracking-wider  self-center w-full ">
          Firma Bilgileri
        </text>
        {resultBelowFirms?.data?.data?.firms.length === 0 ||
        resultBelowFirms.isError === true ? (
          ""
        ) : (
          <div className="flex my-3 justify-between items-center">
            <div className="flex gap-3 items-center text-fourth">
              <button className={`${button}`} onClick={hideSearchBar}>
                <p className={``}>FİLTRELE</p>
                <IoIosArrowUp
                  className={`${
                    searchBar ? "flex" : "hidden"
                  } transition-all duration-500`}
                />
                <IoIosArrowDown
                  className={`${
                    searchBar ? "hidden" : "flex"
                  } transition-all duration-500`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
      {resultBelowFirms.isFetching ? (
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
      ) : resultBelowFirms?.data?.data?.firms.length === 0 ||
        resultBelowFirms.isError === true ? (
        <div className=" text-SemiBold">Alt firma bulunamadı</div>
      ) : (
        <>
          <div
            className={`bg-white w-full rounded-xl shadow-xl transition-all duration-300 mb-4 ${
              searchBar ? "block p-10" : " overflow-hidden h-0"
            }`}
          >
            <DataSearchBar Data={Datas} handleSearch={handleSearch} />
          </div>
          <div className=" flex flex-col w-full gap-4 bg-white rounded-lg shadow-xl p-8 h-fit  transition-all duration-300">
            <div className="flex flex-col w-full items-center">
              <PaginationBar
                elements={isSearch ? filteredData : Datas}
                info="Bu bilgilerde bir fatura bulunamadı."
                paginationNumber={paginationNumber}
                setPaginationNumber={setPaginationNumber}
              />
            </div>
            <div className=" w-full">
              <SortableTable
                data={isSearch ? filteredData : Datas}
                config={config}
                keyFn={keyFn}
                paginationNumber={paginationNumber}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ControlFirm;
