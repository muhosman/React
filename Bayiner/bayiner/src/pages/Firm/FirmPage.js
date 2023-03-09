import SortableTable from "../../components/SortableTable";
import PaginationBar from "../../components/PaginationBar";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MdAddBusiness } from "react-icons/md";
import { BsFillPencilFill } from "react-icons/bs";
import { TbReportAnalytics } from "react-icons/tb";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import DataSearchBar from "./FirmSearchBar";
import useAuth from "../../hooks/useAuth";
import { Blocks } from "react-loader-spinner";
import { useFetchFirmQuery } from "../../store";
import styles from "../../CustomStyles";
function FirmPage() {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const [paginationNumber, setPaginationNumber] = useState(1);
  const [searchBar, setSearchBar] = useState(true);

  const ResultFirms = useFetchFirmQuery(token);

  const [filteredData, setFilteredData] = useState("");
  const [isSearch, setIsSearch] = useState();

  const Datas = ResultFirms?.data?.data?.Firms || [];

  useEffect(() => {
    setIsSearch(false);
  }, []);

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
      render: (data) => (
        <div className="flex flex-row justify-center">
          <NavLink to={`Düzenle/${data._id}/Bilgi`} forceRefresh={true}>
            <button className={`${styles.tableButton} `}>
              <BsFillPencilFill className={`${styles.buttonIcon}`} />
            </button>
          </NavLink>

          <NavLink to={`Bilgi/${data._id}/Genel`}>
            <button className={` ${styles.tableButton}  `}>
              <TbReportAnalytics className={`${styles.buttonIcon}`} />
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
      label: "Ana Firma",
      render: (data) => (
        <div>
          <div className=" md:hidden opacity-40 font-Bold">Ana Firma:</div>

          {data.mainFirmName === undefined || data.mainFirmName === ""
            ? "Ana Firma"
            : data.mainFirmName}
        </div>
      ),
      sortValue: (data) => data.mainFirmName,
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
            <div>{data.email}</div>
            <div>{data.tel}</div>
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
            <div>{data.address.city}</div>
            <div>{data.address.town}</div>
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
    <>
      <div className="mr-8 z-0 md:ml-0 ml-8">
        <div className=" w-full inline-block align-middle">
          <div className="flex my-3 gap-4 md:flex-row flex-col  md:items-center ">
            <div className="flex gap-3 items-center text-fourth xl:text-XL text-BASE">
              <div className={`${styles.PageHeader}`}>Firma Listesi</div>
              <div
                className={`${styles.PageHeader} bg-slate-800 text-white px-2 rounded-full`}
              >
                {Datas.length}
              </div>
            </div>

            <div>
              <NavLink to="Oluştur" target="_self">
                <button className={`${styles.button}`}>
                  <MdAddBusiness className={`${styles.buttonIcon}`} />
                  <div className="font-SemiBold">Firma Ekle</div>
                </button>
              </NavLink>
            </div>
            <button
              className={`${styles.button} w-fit`}
              onClick={hideSearchBar}
            >
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
            <DataSearchBar Data={Datas} handleSearch={handleSearch} />
          </div>
          <div className="flex flex-col items-center gap-6 bg-white rounded-xl p-6 mb-5 overflow-hidden shadow border ">
            {ResultFirms.isFetching ? (
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
            ) : ResultFirms?.data?.results === 0 ||
              ResultFirms.isError === true ? (
              <div className=" text-SemiBold">Cihaz bulunamadı</div>
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
    </>
  );
}

export default FirmPage;
