import SortableTable from "../../components/SortableTable";
import PaginationBar from "../../components/PaginationBar";
import { useEffect, useState } from "react";
import { BsFillPencilFill, BsFillPersonPlusFill } from "react-icons/bs";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useFetchUserQuery } from "../../store";
import { Blocks } from "react-loader-spinner";
import DataSearchBar from "../../components/DataSearchBar";
import styles from "../../CustomStyles";

function UsersPage() {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const responseDatas = useFetchUserQuery(token);
  let Datas = responseDatas.data?.data?.users || [];
  Datas = Datas.filter((user) => user._id !== auth._id);
  const inputFieldName = {
    name: "İsim",
    lastName: "Soyisim",
    email: "Email",
  };
  const [paginationNumber, setPaginationNumber] = useState(1);
  const [searchBar, setSearchBar] = useState(true);
  const [filteredData, setFilteredData] = useState("");
  const [isSearch, setIsSearch] = useState(false);

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
      render: (user) => (
        <div className="flex flex-row justify-center">
          <NavLink to={`edit/${user._id}/info`} forceRefresh={true}>
            <button className={`${styles.tableButton}`}>
              <BsFillPencilFill className={`${styles.buttonIcon}`} />
            </button>
          </NavLink>
        </div>
      ),
    },
    {
      label: "İsim",
      render: (user) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">İsim:</div>
          {user.name}
        </>
      ),
      sortValue: (user) => user.name,
    },
    {
      label: "Soyisim",
      render: (user) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Soyisim:</div>
          {user.lastName}
        </>
      ),
      sortValue: (user) => user.lastName,
    },
    {
      label: "Rol",
      render: (user) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Rol:</div>
          {user.role}
        </>
      ),
      sortValue: (user) => user.role,
    },
    {
      label: "İletişim",
      render: (user) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">İletişim:</div>
          <div>
            <div>{user.email}</div>
            <div>{user.tel}</div>
          </div>
        </>
      ),
    },
    {
      label: "Firma İsmi",
      render: (user) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Firma İsmi:</div>
          {user.firmName}
        </>
      ),
      sortValue: (user) => user.firmName,
    },
    {
      label: "Telefon",
      render: (user) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Telefon:</div>
          {user.tel}
        </>
      ),
    },
    {
      label: "Aktiflik",
      render: (user) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Aktivite:</div>
          {user.isActive ? "Aktif" : "Pasif"}
        </>
      ),
      sortValue: (user) => user.isActive,
    },
  ];
  const keyFn = (user) => {
    return user.id;
  };

  return (
    <div className="mr-8 max-md:ml-8 z-0">
      <div className=" w-full inline-block align-middle">
        <div className="flex my-3 gap-4  items-center ">
          <div className="flex gap-3 items-center text-fourth">
            <p className={`${styles.PageHeader}`}>Kullanıcı Listesi</p>
            <div
              className={`${styles.PageHeader} bg-slate-800 text-white px-2 rounded-full`}
            >
              {Datas.length}
            </div>
          </div>

          <div>
            <NavLink to="create" target="_self">
              <button className={`${styles.button}`}>
                <BsFillPersonPlusFill className={`${styles.buttonIcon}`} />
                <div className="font-SemiBold">Kullanıcı Ekle</div>
              </button>
            </NavLink>
          </div>
          <button className={`${styles.button}`} onClick={hideSearchBar}>
            <p className={``}>FİLTRELE</p>
            <IoIosArrowUp
              className={`${searchBar ? "flex" : "hidden"} ${
                styles.buttonIcon
              } transition-all duration-500`}
            />
            <IoIosArrowDown
              className={`${
                searchBar ? "hidden" : "flex"
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
            Data={Datas}
            inputFieldName={inputFieldName}
            handleSearch={handleSearch}
          />
        </div>
        <div className="flex flex-col items-center gap-6 bg-white rounded-xl p-6 mb-5 overflow-hidden shadow border ">
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
          ) : responseDatas.error || responseDatas?.data?.results === 1 ? (
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

export default UsersPage;
