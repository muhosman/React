import styles from "../CustomStyles";
import { Blocks } from "react-loader-spinner";
import { useState, useRef, useEffect } from "react";
import Graph from "../components/Graph/DashboardBar";
import { useFetchStockQuery, useUpdateStockMutation } from "../store";
import useAuth from "../hooks/useAuth";
import { TbTrash, TbEdit } from "react-icons/tb";
import PaginationBar from "../components/PaginationBar";
import Alerts from "../components/Alert";
import Confirm from "../components/Confirm";
import DataSearchBar from "../components/DataSearchBar";

export default function StockPage() {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const randomColor = () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16);
  const responseData = useFetchStockQuery(token);
  const [Update, resultUpdate] = useUpdateStockMutation();
  const Datas = responseData.data?.data?.stocks;
  const Product = {};
  console.log(responseData);
  const [input, setInput] = useState("");
  const inputRefQuota = useRef(null);
  const inputFieldName = {
    productName: "Ürün İsmi",
    productCode: "Ürün Kodu",
  };
  const inputField = {
    quota: "Yüklenecek Stok",
    productName: "Ürün İsmi",
  };
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [designModel, setDesignModel] = useState(false);
  const [action, setAction] = useState(0);
  const [alert, setAlert] = useState(0);
  const [message, setMessage] = useState("");
  const [inputFocus, setInputFocus] = useState("quota");
  const [paginationNumber, setPaginationNumber] = useState(1);
  const [isSearch, setIsSearch] = useState(false);
  const [searchBar, setSearchBar] = useState(true);
  const [filteredData, setFilteredData] = useState("");

  Datas?.forEach((data) => {
    Product[data.productName] = data.quota;
  });

  const ProductData = [{ ...Product }];

  const ProductBars = Datas?.map((data) => {
    return { dataKey: data.productName, fill: randomColor() };
  });
  const [active, setActive] = useState(1);

  const handleModel = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
    setDesignModel(false);
  };

  const handleCloseModel = (boolean) => {
    if (boolean) {
      if (action === 2) {
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

  const handleChange = (event) => {
    if (event.target.name === "quota") {
      setInput({ ...input, [event.target.name]: event.target.value });
    }
    setInputFocus(event.target.name);
  };

  const handleSearch = (data, isSearch) => {
    setPaginationNumber(1);
    setFilteredData(data);
    setIsSearch(isSearch);
  };

  useEffect(() => {
    if (inputRefQuota.current && inputFocus === "quota") {
      inputRefQuota.current.focus();
    }
  }, [inputRefQuota.current]);

  const DesignModel = () => {
    return (
      <form onSubmit={handleModel} className=" flex flex-col gap-6 min-w-max  ">
        <div
          className={`${styles.cardTitle} text-center w-full p-4 rounded-t-xl bg-fourth text-white`}
        >
          Stok Yükleme
        </div>
        <div className="flex flex-col gap-6 min-w-max px-8 pb-4">
          <text className={` ${styles.textTitle}`}>
            Yüklenecek Stok Miktarı
          </text>
          <input
            className={` ${styles.inputTag}`}
            id="name"
            name="quota"
            value={input.quota}
            ref={inputRefQuota}
            placeholder={"Miktar"}
            required
            onInput={handleChange}
          />
        </div>
        <button
          onClick={() => {}}
          className={`${styles.buttonSearch}  
          px-6 py-3 w-fit self-center mb-2`}
        >
          Yükle
        </button>
      </form>
    );
  };
  const filteredProductType = (isSearch ? filteredData : Datas)?.filter(
    (City, index) => {
      if (
        index >= paginationNumber * 10 - 10 &&
        index <= paginationNumber * 10 - 1
      )
        return City;
    }
  );

  const content = filteredProductType?.map((Data) => {
    return (
      <div className={`bg-white rounded-md shadow-lg`}>
        <div
          className={`text-center w-full p-4 rounded-t-xl bg-fourth text-white relative`}
        >
          <p className={`${styles.cardTitle}`}>Stok Bilgisi</p>
        </div>

        <div className=" p-10">
          <div className=" flex flex-col gap-4 ">
            <div>
              <text className={` ${styles.textTitle}`}>Ürün İsmi: </text>
              <text className={`${styles.text}`}>{Data.productName}</text>
            </div>
            <div>
              <text className={` ${styles.textTitle}`}>Ürün Kodu: </text>
              <text className={`${styles.text}`}>{Data.productCode}</text>
            </div>
            <div>
              <text className={` ${styles.textTitle}`}>Kota: </text>
              <text className={`${styles.text}`}>{Data.quota}</text>
            </div>
            <div className=" flex gap-4 items-center justify-center mt-6">
              <div className=" rounded-md border-2 border-fourth w-fit p-[4px]">
                <TbEdit
                  onClick={() => {
                    setInput({
                      ...input,
                      quota: 0,
                      productName: Data.productName,
                      id: Data._id,
                      token: token,
                    });
                    setDesignModel(true);
                    setAction(2);
                  }}
                  className=" w-8 h-8 rounded-md border-2 hover:text-slate-400 hover:border-slate-400 text-fourth border-fourth cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="mr-8 z-0 md:ml-0 ml-8 mb-10">
      <div className=" w-full h-full inline-block align-middle">
        <div className="flex my-3 gap-4 md:flex-row flex-col  md:items-center ">
          <div className="flex gap-3 items-center text-fourth xl:text-XL text-BASE">
            <button
              className={`${
                styles.PageHeader
              } transition-all duration-500 p-4  ${
                active === 1 ? "text-white bg-fourth rounded-md" : ""
              }`}
              onClick={() => {
                Update(token);
                setActive(1);
              }}
            >
              Stok Grafiği
            </button>
            <div className={`${styles.PageHeader}`}>-</div>

            <button
              onClick={() => setActive(2)}
              className={`${
                styles.PageHeader
              } transition-all duration-500 p-4 ${
                active === 2 ? "text-white bg-fourth  rounded-md" : ""
              }`}
            >
              Stok Yönetimi
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full h-full items-center gap-4 rounded-md mb-10 ">
          {responseData.isFetching ? (
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
          ) : responseData.isError || responseData.data?.results === 0 ? (
            <div className=" text-SemiBold">Stock bulunamadı</div>
          ) : (
            <>
              {active === 1 && (
                <div className=" w-full h-[36rem] mb-10">
                  <Graph data={ProductData} bars={ProductBars} />
                </div>
              )}
              {active === 2 && (
                <>
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
                    inputFieldName={inputField}
                    handleCloseModel={handleCloseModel}
                    showConfirmModal={showConfirmModal}
                  />
                  <div
                    className={`bg-white w-full rounded-xl shadow transition-all duration-300 mb-4 ${
                      searchBar ? "block p-10" : " overflow-hidden h-0"
                    }`}
                  >
                    <DataSearchBar
                      Data={Datas}
                      handleSearch={handleSearch}
                      token={token}
                      inputFieldName={inputFieldName}
                    />
                  </div>
                  <div className="flex flex-col items-center z-0 ">
                    <PaginationBar
                      elements={isSearch ? filteredData : Datas}
                      info="Bu bilgilerde bir cihaz bulunamadı."
                      paginationNumber={paginationNumber}
                      setPaginationNumber={setPaginationNumber}
                    />
                  </div>
                  <div className=" grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-8 mt-6 z-0 mb-10">
                    {content}
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
                    className={`fixed z-50 top-1/2 left-1/2 -translate-y-1/2 overflow-y-scroll no-scrollbar rounded-xl 
          -translate-x-1/2  w-fit ${
            showConfirmModal ? "h-fit" : " max-h-[41rem]"
          }`}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
