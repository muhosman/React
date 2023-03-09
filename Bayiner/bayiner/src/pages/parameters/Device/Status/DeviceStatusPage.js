import { useState, useEffect, useRef } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { BiPlusMedical } from "react-icons/bi";
import Alerts from "../../../../components/Alert";
import { TbTrash, TbEdit } from "react-icons/tb";
import {
  useFetchDeviceStatusQuery,
  useUpdateDeviceStatusMutation,
  useDeleteDeviceStatusMutation,
  useAddDeviceStatusMutation,
} from "../../../../store";
import useAuth from "../../../../hooks/useAuth";
import PaginationBar from "../../../../components/PaginationBar";
import { Blocks } from "react-loader-spinner";
import DataSearchBar from "./StatusSearchBar";
import Confirm from "../../../../components/Confirm";
import styles from "../../../../CustomStyles";

const TownPage = function () {
  const { auth } = useAuth();
  const token = auth.accessToken;

  const [isSearch, setIsSearch] = useState(false);

  const [input, setInput] = useState("");
  const inputRefName = useRef(null);
  const [inputFocus, setInputFocus] = useState("name");

  const [paginationNumber, setPaginationNumber] = useState(1);
  const [filteredData, setFilteredData] = useState("");
  const [searchBar, setSearchBar] = useState(true);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [designModel, setDesignModel] = useState(false);
  const [inputFieldName, setInputFieldName] = useState({});

  const [action, setAction] = useState(0);
  const [alert, setAlert] = useState(0);
  const [message, setMessage] = useState("");

  const responseDeviceStatus = useFetchDeviceStatusQuery(token);

  const [Update, resultUpdate] = useUpdateDeviceStatusMutation();
  const [Delete, resultDelete] = useDeleteDeviceStatusMutation();
  const [Add, resultAdd] = useAddDeviceStatusMutation();

  const Data = responseDeviceStatus?.data?.data?.deviceStatuses || [];

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

  const handleModal = (e) => {
    e.preventDefault();
    setInputFieldName({ name: "Durum İsmi" });
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

  const hideSearchBar = () => {
    setSearchBar(searchBar === true ? false : true);
  };

  const handleChange = (event) => {
    if (event.target.name === "name") {
      setInput({ ...input, [event.target.name]: event.target.value });
    }
    setInputFocus(event.target.name);
  };

  useEffect(() => {
    if (inputRefName.current && inputFocus === "name") {
      inputRefName.current.focus();
    }
  }, [inputRefName.current]);

  const DesignModel = () => {
    return (
      <form onSubmit={handleModal} className=" flex flex-col gap-6 min-w-max  ">
        <div
          className={`${styles.cardTitle} text-center w-full p-4 rounded-t-xl bg-fourth text-white`}
        >
          Ürün Tipi Bilgileri
        </div>
        <div className="flex flex-col gap-2 min-w-max px-8 pb-4">
          <text className={`${styles.textTitle}`}>Cihaz Durumu İsmi:</text>
          <input
            className={` ${styles.inputTag}`}
            id="name"
            type="text"
            name="name"
            value={input.name}
            ref={inputRefName}
            placeholder={"Yeni Durum İsmi"}
            maxLength="40"
            required
            onInput={handleChange}
          />
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

  const handleSearch = (data, isSearch) => {
    setPaginationNumber(1);
    setFilteredData(data);
    setIsSearch(isSearch);
  };

  const filteredProductType = (isSearch ? filteredData : Data)?.filter(
    (Data, index) => {
      if (
        index >= paginationNumber * 10 - 10 &&
        index <= paginationNumber * 10 - 1
      )
        return Data;
    }
  );

  const content = filteredProductType?.map((Data) => {
    return (
      <div className={`bg-white rounded-md shadow-lg`}>
        <div
          className={`text-center w-full p-4 rounded-t-xl bg-fourth text-white relative`}
        >
          <p className={`${styles.cardTitle}`}>Cihaz Durum Tipi</p>
        </div>
        <div className=" p-10">
          <div className=" flex flex-col gap-4 ">
            <div>
              <text className={` ${styles.textTitle}`}>Durum: </text>
              <text className={`${styles.text}`}>{Data.name}</text>
            </div>
          </div>
          <div className=" flex gap-4 items-center justify-center mt-6">
            <div className=" rounded-md border-2 border-fourth w-fit p-[4px]">
              <TbEdit
                onClick={() => {
                  setInput({
                    ...input,
                    name: Data.name,
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
                    name: Data.name,
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
                name: "",
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
            token={token}
          />
        </div>
      </div>

      {responseDeviceStatus.isFetching ? (
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
      ) : responseDeviceStatus.error ||
        responseDeviceStatus.data?.results === 0 ? (
        <div className=" text-SemiBold">Cihaz durumları bulunamadı !</div>
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

export default TownPage;
