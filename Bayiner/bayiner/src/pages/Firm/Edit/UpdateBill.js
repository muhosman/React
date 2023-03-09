import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { Blocks } from "react-loader-spinner";

import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import DataSearchBar from "./BillSearhcBar";
import SortableTable from "../../../components/SortableTable";
import PaginationBar from "../../../components/PaginationBar";
// Icon
import { TiDeleteOutline } from "react-icons/ti";
import { useDeleteBillMutation, useGetBillsQuery } from "../../../store";
import { useParams } from "react-router-dom";
import styles from "../../../CustomStyles";
import Alerts from "../../../components/Alert";
import Confirm from "../../../components/Confirm";

function UpdateBill() {
  const { id } = useParams();
  const { auth } = useAuth();
  const token = auth.accessToken;
  const [paginationNumber, setPaginationNumber] = useState(1);
  const [searchBar, setSearchBar] = useState(true);
  const [filteredData, setFilteredData] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  const [inputFieldName, setInputFieldName] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [alert, setAlert] = useState(0); // 1- success 2-error 3-warning
  const [message, setMessage] = useState("");
  const [action, setAction] = useState(0); // 1- add 2-update 3-delete 0- default

  const [input, setInput] = useState({ id: id, token: token });
  const [deleteInput, setDeleteInput] = useState("");
  const [Delete, resultDelete] = useDeleteBillMutation();

  const hideSearchBar = () => {
    setSearchBar(searchBar === true ? false : true);
  };

  const handleSearch = (data, isSearch) => {
    setPaginationNumber(1);
    setFilteredData(data);
    setIsSearch(isSearch);
  };
  useEffect(() => {
    setIsSearch(false);
  }, []);

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
    handleApiResponse(resultDelete, "Fatura başarıyla silindi !");
  }, [resultDelete]);

  const handleModal = () => {
    setInputFieldName({ message: "İşlem" });
    setShowConfirmModal(true);
  };

  const handleCloseModel = (boolean) => {
    if (boolean) {
      if (action === 2) {
        const Object = { id: deleteInput.id, token: deleteInput.token };
        Delete(Object);
        setShowConfirmModal(false);
      }
    } else {
      setShowConfirmModal(false);
      setAction(0);
    }
  };

  const responseDatas = useGetBillsQuery(input);
  const Datas = responseDatas.data?.data?.bills || [];

  const config = [
    {
      label: " Fatura No",
      render: (data) => (
        <button
          onClick={() => {
            setAction(2);
            setDeleteInput({
              id: data._id,
              token: token,
              message: "Faturayı silmek isteğinize emin misiniz ?",
            });
            handleModal();
          }}
          className=" hover:text-slate-400 text-fourth transition-all duration-500"
        >
          <TiDeleteOutline className={`${styles.buttonIcon}`} />
        </button>
      ),
      sortValue: (data) => data.billNo,
    },
    {
      label: " Fatura No",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Fatura No:</div>
          {data.billNo}
        </>
      ),
      sortValue: (data) => data.billNo,
    },
    {
      label: "Ürün İsmi",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Ürün İsmi:</div>
          {data.productName}{" "}
        </>
      ),
      sortValue: (data) => data.productName,
    },
    {
      label: "Miktar",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Miktar:</div>
          {data.quota}
        </>
      ),
      sortValue: (data) => data.quota,
    },
    {
      label: "Gelir",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Gelir:</div>
          {data.income}
        </>
      ),
      sortValue: (data) => data.income,
    },
    {
      label: "Birim Fiyat",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Birim Fiyat:</div>
          {data.price.toFixed(2)}
        </>
      ),
      sortValue: (data) => data.price.toFixed(2),
    },
    {
      label: "Tarih",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Tarih:</div>
          {data.createdInfo}
        </>
      ),
      sortValue: (data) => data.date,
    },
  ];
  const keyFn = (data) => {
    return data.id;
  };
  useEffect(() => {
    setInput({
      ...input,
      token: token,
    });
  }, []);

  return (
    <div className=" grid w-full">
      {alert !== 0 && (
        <div
          className="fixed z-10 left-1/2 top-0
  -translate-x-1/2"
        >
          <Alerts AlertChoice={alert} message={message} />
        </div>
      )}
      <Confirm
        input={deleteInput}
        inputFieldName={inputFieldName}
        handleCloseModel={handleCloseModel}
        showConfirmModal={showConfirmModal}
      />
      <div className="flex flex-col md:flex-row border-b-4 border-fourth w-full h-fit mb-4">
        <text
          className={`flex items-center font-SemiBold tracking-wider  self-center w-full ${styles.DesignFieldHeader}`}
        >
          Fatura Bilgileri
        </text>
        <div className="flex my-3 justify-between items-center">
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

      <div
        className={`bg-white shadow-lg w-full  rounded-xl  transition-all duration-300 mb-4 ${
          searchBar ? "block p-10" : " overflow-hidden h-0"
        }`}
      >
        <DataSearchBar Data={Datas} handleSearch={handleSearch} />
      </div>

      {responseDatas.isLoading || resultDelete.isLoading ? (
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
        <div className="">Fatura bulunamadı</div>
      ) : (
        <div className=" flex flex-col w-full gap-4 rounded-lg  p-8 h-fit  transition-all duration-300 bg-white shadow-lg">
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
      )}
    </div>
  );
}

export default UpdateBill;
