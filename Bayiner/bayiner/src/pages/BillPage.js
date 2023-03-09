import SortableTable from "../components/SortableTable";
import PaginationBar from "../components/PaginationBar";
import { useState, useEffect, useRef } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { TbReportAnalytics } from "react-icons/tb";
import { TiTick } from "react-icons/ti";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import useAuth from "../hooks/useAuth";
import { Blocks } from "react-loader-spinner";
import Alerts from "../components/Alert";

import { useControllBillsMutation, useCreateBillsMutation } from "../store";
import styles from "../CustomStyles";
import * as XLSX from "xlsx";
import DataSearchBar from "../components/DataSearchBar";

function BillPage() {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const [paginationNumber, setPaginationNumber] = useState(1);
  const [searchBar, setSearchBar] = useState(true);
  const inputFieldName = {
    billNo: "Fatura Numarası",
    firmApellation: "Firma Ünvanı",
    bayserNo: "Bayser Numarası",
  };
  const hiddenFileInput = useRef(null);
  const [alert, setAlert] = useState(0);
  const [message, setMessage] = useState("");
  const [filteredData, setFilteredData] = useState("");
  const [isSearch, setIsSearch] = useState();
  const [create, resultCreate] = useCreateBillsMutation();
  const [controll, resultControll] = useControllBillsMutation();

  let Datas = [];

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

  const hideSearchBar = () => {
    setSearchBar(searchBar === true ? false : true);
  };

  const handleSearch = (data, isSearch) => {
    setPaginationNumber(1);
    setFilteredData(data);
    setIsSearch(isSearch);
  };

  const handleApiResponse = (apiResponse, successMessage) => {
    if (apiResponse.isError) {
      setAlert(2);
      setMessage("İşlem başarısız tekrar deneyin !");
    }
    if (apiResponse.isSuccess) {
      setAlert(1);
      setMessage(successMessage);
    }
  };

  useEffect(() => {
    handleApiResponse(resultCreate, "Faturalar Tanımlandı !");
  }, [resultCreate.isSuccess, resultCreate.isError]);
  useEffect(() => {
    handleApiResponse(resultControll, "Fatura Kontrolü Yapıldı !");
  }, [resultControll.isSuccess, resultControll.isError]);

  const config = [
    {
      label: "Fatura Numarası",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">
            Fatura Numarası:
          </div>
          {data.billNo}
        </>
      ),
      sortValue: (data) => data.billNo,
    },
    {
      label: " Firma Ünvan",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Firma Ünvan:</div>
          {data.firmApellation}
        </>
      ),
      sortValue: (data) => data.firmApellation,
    },

    {
      label: "Bayser No",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Bayser No:</div>
          {data.bayserNo}
        </>
      ),
    },
    {
      label: "Ürün Kodu",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Ürün Kodu:</div>
          {data.productCode}
        </>
      ),
      sortValue: (data) => data.productCode,
    },
    {
      label: "Ürün İsmi",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Ürün İsmi:</div>
          {data.productName}
        </>
      ),
      sortValue: (data) => data.productName,
    },
    {
      label: "Kota",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Kota:</div>
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
      label: "Durum",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Durum:</div>

          <div className="flex items-center">
            <RxCross2
              className={`${
                data.failureMessage !== "Fatura yüklenmeye hazır !" &&
                data.failureMessage !== "Fatura başarıyla yüklendi !"
                  ? "flex"
                  : "hidden"
              } ${styles.buttonIcon} text-fifth`}
            />
            <TiTick
              className={`${
                data.failureMessage !== "Fatura yüklenmeye hazır !" &&
                data.failureMessage !== "Fatura başarıyla yüklendi !"
                  ? "hidden"
                  : "flex"
              } ${styles.buttonIcon} text-sixth`}
            />

            {data.failureMessage}
          </div>
        </>
      ),
      sortValue: (data) => data.failureMessage,
    },
  ];

  const keyFn = (data) => {
    return data._id;
  };
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      Datas = d.map((obj) => {
        const price = obj["SATIR TOPLAMI"] / obj["SATIR MİKTARI"];
        return {
          bayserNo: obj["BAYSER NO"],
          firmApellation: obj["CARİ HESAP ÜNVANI"],
          billNo: obj["FİŞ NUMARASI"],
          shippingInfo: obj["SEVK AÇIKLAMA"],
          productName: obj["MALZEME AÇIKLAMASI"],
          productCode: obj["MALZEME KODU"],
          price: obj["SATIR TOPLAMI"] / obj["SATIR MİKTARI"],
          quota: obj["SATIR MİKTARI"],
          income: obj["SATIR TOPLAMI"],
        };
      });
      const Object = { bills: Datas, token: token };
      controll(Object);
    });
  };

  const HandleUpload = () => {
    const Object = { bills: resultControll.data?.bills, token: token };
    create(Object);
  };

  return (
    <div className="mr-8 z-0 md:ml-0 ml-8">
      {alert !== 0 && (
        <div
          className="fixed z-10 left-1/2 top-0
    -translate-x-1/2"
        >
          <Alerts AlertChoice={alert} message={message} />
        </div>
      )}
      <div className=" w-full inline-block align-middle">
        <div className="flex my-3 gap-4 md:flex-row flex-col  md:items-center ">
          <div className="flex gap-3 items-center text-fourth xl:text-XL text-BASE">
            <div className={`${styles.PageHeader}`}>Fatura Listesi</div>
            <div
              className={`${styles.PageHeader} bg-slate-800 text-white px-2 rounded-full`}
            >
              {resultControll?.data?.results}
            </div>
          </div>

          <div>
            <button
              className={`${styles.button}`}
              onClick={() => hiddenFileInput.current.click()}
            >
              <AiOutlineCloudUpload className={`${styles.buttonIcon}`} />
              <p>Fatura Yükle</p>
            </button>
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={(e) => {
                const file = e.target.files[0];
                readExcel(file);
              }}
              style={{ display: "none" }}
            />
          </div>
          <div>
            <button onClick={HandleUpload} className={`${styles.button}`}>
              <TbReportAnalytics className={`${styles.buttonIcon}`} />
              <p>Fatura Kaydet</p>
            </button>
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
          <DataSearchBar
            Data={
              resultCreate?.isSuccess
                ? resultCreate.data?.bills
                : resultControll.data?.bills
            }
            handleSearch={handleSearch}
            inputFieldName={inputFieldName}
          />
        </div>
        <div className="flex flex-col items-center gap-6 bg-white rounded-xl p-6 mb-5 overflow-hidden shadow border ">
          {resultControll?.isLoading || resultCreate?.isLoading ? (
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
          ) : resultControll.data?.results === 0 ||
            !resultControll?.isSuccess ? (
            <div className=" text-SemiBold">Fatura oluşturulmadı</div>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <PaginationBar
                  elements={
                    isSearch
                      ? filteredData
                      : resultCreate?.isSuccess
                      ? resultCreate.data?.bills
                      : resultControll.data?.bills
                  }
                  info="Bu bilgilerde bir cihaz bulunamadı."
                  paginationNumber={paginationNumber}
                  setPaginationNumber={setPaginationNumber}
                />
              </div>
              <SortableTable
                data={
                  isSearch
                    ? filteredData
                    : resultCreate?.isSuccess
                    ? resultCreate.data?.bills
                    : resultControll.data?.bills
                }
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

export default BillPage;
