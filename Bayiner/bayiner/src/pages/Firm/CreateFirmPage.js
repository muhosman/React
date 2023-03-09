import { useState, useEffect } from "react";
import { MdAddBusiness } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { GiConfirmed, GiCancel } from "react-icons/gi";
import useAuth from "../../hooks/useAuth";
import { NavLink } from "react-router-dom";
import Alerts from "../../components/Alert";
import { Blocks } from "react-loader-spinner";
import styles from "../../CustomStyles";
import { useNavigate } from "react-router-dom";

import {
  useAddFirmMutation,
  useFetchCityQuery,
  useFetchFirmQuery,
  useFetchTownQuery,
} from "../../store";
import DropDown from "../../components/DropDown";

function CreateFirmPage() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const token = auth.accessToken;

  const CityResult = useFetchCityQuery(token);
  const TownResult = useFetchTownQuery(token);
  const City = CityResult?.data?.data?.cities;
  const Town = TownResult?.data?.data?.towns;

  const [add, resultAdd] = useAddFirmMutation();
  const [alert, setAlert] = useState(0); // 1- success 2-error 3-warning
  const [message, setMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const MainFirmData = useFetchFirmQuery(token);

  const MainFirms = MainFirmData?.data?.data?.Firms || [];

  const [input, setInput] = useState({
    name: "",
    mainFirmID: "",
    isCorporate: false,
    officialID: "",
    taxNumber: "",
    taxOffice: "",
    email: "",
    tel: "",
    note: "",
    address: { text: "", city: "", town: "" },
    token: token,
  });

  useEffect(() => {
    if (alert !== 0) {
      setTimeout(() => {
        if (alert === 1) {
          setAlert(0);
          setMessage("");
          navigate("/Anasayfa/Firma");
        }
        setAlert(0);
        setMessage("");
      }, 2000);
    }
  }, [alert]);

  useEffect(() => {
    if (resultAdd.isError === true) {
      setAlert(2);
      setMessage("İşlem başarısız tekrar deneyin !");
    }
    if (resultAdd.isSuccess === true) {
      setAlert(1);
      setMessage("İşlem başarı ile gerçekleşti !");
    }
  }, [resultAdd.isSuccess, resultAdd.isError]);

  const handleOpenModal = async (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleCloseModel = (bool) => {
    setShowConfirmModal(false);
  };

  const handleAdd = () => {
    if (input.isCorporate === false && input.mainFirmID === "") {
      setAlert(2);
      setMessage(
        "Ana firma olmayan bir firma, başka bir firmaya bağlı olmak zorundadır !"
      );
      setShowConfirmModal(false);
    } else {
      add(input);
      setShowConfirmModal(false);
    }
  };

  const CityOptions = City?.map((data) => {
    return { label: data.name, value: data.name };
  });
  const handleSelectCity = (option) => {
    City?.map((data) => {
      if (option.value === data.name) {
        setInput({
          ...input,
          address: {
            town: input.address.town,
            text: input.address.text,
            city: data.name,
          },
        });
      }
    });
  };
  const TownOptions = Town?.map((data) => {
    return { label: data.name, value: data.name };
  });
  const handleSelectTown = (option) => {
    Town?.map((data) => {
      if (option.value === data.name) {
        setInput({
          ...input,
          address: {
            town: data.name,
            text: input.address.text,
            city: input.address.city,
          },
        });
      }
    });
  };

  const MainFirmOptions = MainFirms?.map((data) => {
    return { label: data.name, value: data.name };
  });
  const handleSelectMainFirm = (option) => {
    MainFirms?.map((data) => {
      if (option.value === data.name) {
        setInput({
          ...input,
          mainFirmID: data._id,
          mainFirmName: data.name,
        });
      }
    });
  };

  return (
    <div className="fixed w-screen h-screen top-0 left-0 z-50 bg-background">
      {/*
        Confirm Modal
      */}
      {alert !== 0 && (
        <div
          className="fixed z-50 left-1/2 top-0
    -translate-x-1/2"
        >
          <Alerts AlertChoice={alert} message={message} />
        </div>
      )}
      <div
        className={`z-50 flex items-center justify-center absolute ${
          showConfirmModal ? "flex" : "hidden"
        } w-full h-full bg-opacity-50 transition-all duration-100`}
      >
        <div
          onClick={() => handleCloseModel(false)}
          className="fixed inset-0 bg-gray-300 opacity-80 "
        ></div>
        <div className=" flex z-10 flex-col gap-3 bg-slate-600  mx-auto w-fit p-1 rounded-xl ">
          <div className="bg-white rounded-xl p-4 flex flex-col gap-5">
            <div className="flex gap-2">
              <text className="font-Bold">Firma İsmi:</text>
              <text>{input.name}</text>
            </div>
            {input.mainFirmName?.length === 0 ? (
              <div>
                <text className="font-Bold">Ana Firma: </text>
                <text>{input.mainFirmName}</text>
              </div>
            ) : (
              <></>
            )}

            <div>
              <text className="font-Bold">Pozisyon: </text>
              <text>{input.isCorporate ? "Ana Firma" : "Şube"}</text>
            </div>
            <div>
              <text className="font-Bold">Tc NO: </text>
              <text>{input.officialID}</text>
            </div>
            <div>
              <text className="font-Bold">Vergi Numarası: </text>
              <text>{input.taxNumber}</text>
            </div>
            <div>
              <text className="font-Bold">Vergi Dairesi: </text>
              <text>{input.taxOffice}</text>
            </div>
            <div>
              <text className="font-Bold">Telefon: </text>
              <text>{input.tel}</text>
            </div>
            <div>
              <text className="font-Bold">Email: </text>
              <text>{input.email}</text>
            </div>
            <div className="flex gap-2 items-center justify-center">
              <button
                onClick={handleAdd}
                className="flex items-center bg-slate-800 text-white p-2 rounded-xl border-4
              hover:bg-white hover:border-slate-800 hover:text-slate-800"
              >
                <GiConfirmed />
                Onay
              </button>
              <button
                onClick={handleCloseModel}
                className="flex items-center bg-white border-4 rounded-xl p-2 hover:bg-slate-600 hover:text-white"
              >
                <GiCancel />
                İptal
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*
      Top Absolute Information
      */}
      <div className="absolute top-0 bg-fourth z-30 w-full h-fit flex justify-between">
        <div className="flex justify-center items-center h-fit bg-fourth text-white p-4">
          <MdAddBusiness className={`${styles.PageHeaderIcon}`} />
          <p className={`${styles.PageHeader}`}>Firma Ekle</p>
        </div>
        <NavLink to="/Anasayfa/Firma">
          <button
            className={`flex px-8 py-2 transition-all duration-200  text-white
           h-14 z-10 justify-center items-center
          hover:text-fifth w-fit `}
          >
            <MdOutlineKeyboardBackspace
              className={`${styles.PageHeaderExitIcon}`}
            />
          </button>
        </NavLink>
      </div>

      {/*
      Device information.
      */}
      {resultAdd.isLoading ? (
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
        <div className="flex flex-col md:m-auto mx-10  h-screen gap-6 md:px-16 ">
          <form
            onSubmit={handleOpenModal}
            className={`flex mt-24 mb-20 flex-col overflow-y-scroll no-scrollbar justify-between`}
          >
            <div className="flex flex-col md:flex-row border-b-4 border-fourth w-full mb-4">
              <p className={`${styles.DesignFieldHeader} w-full self-center `}>
                Firma Bilgileri
              </p>
            </div>
            <div className=" flex flex-col gap-4 rounded-lg bg-white shadow-xl p-8 h-fit">
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 h-fit">
                <div
                  className={` ${
                    input.isCorporate ? "hidden" : "flex"
                  }  flex-col justify-between `}
                >
                  <p className={`${styles.tagText}`}>Ana Firma</p>
                  <DropDown
                    options={MainFirmOptions}
                    value={{
                      label: input.mainFirmName,
                      value: input.mainFirmName,
                    }}
                    DropDownPanel={styles.DropDownPanel}
                    text={styles.DropDownText}
                    onChange={handleSelectMainFirm}
                    search={true}
                    barValue={"Ana Firma"}
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div className="flex items-center">
                    <p className={`${styles.tagText}`}>Firma İsmi / </p>

                    <p className={`${styles.tagText}`}>Ana Bayi</p>
                    <input
                      className={`${styles.InputCheckBox}`}
                      type="checkbox"
                      checked={input.isCorporate}
                      onClick={() => {
                        const active = !input.isCorporate;
                        setInput({ ...input, isCorporate: active });
                      }}
                    />
                  </div>
                  <input
                    className={`${styles.inputTag}`}
                    type="text"
                    value={input.name}
                    placeholder={"Firma İsmi"}
                    maxLength="30"
                    required
                    onInput={(event) => {
                      setInput({ ...input, name: event.target.value });
                    }}
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText}`}>TC No</p>
                  <input
                    className={`${styles.inputTag}`}
                    type="text"
                    value={input.officialID}
                    placeholder={"TC No"}
                    maxLength="30"
                    required
                    onInput={(event) => {
                      setInput({ ...input, officialID: event.target.value });
                    }}
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText}`}>Vergi Numarası</p>
                  <input
                    className={`${styles.inputTag}`}
                    type="text"
                    value={input.taxNumber}
                    placeholder={"Vergi Numarası"}
                    maxLength="30"
                    required
                    onInput={(event) => {
                      setInput({ ...input, taxNumber: event.target.value });
                    }}
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText}`}>Vergi Dairesi</p>
                  <input
                    className={`${styles.inputTag}`}
                    type="text"
                    value={input.taxOffice}
                    placeholder={"Vergi Dairesi"}
                    maxLength="30"
                    required
                    onInput={(event) => {
                      setInput({ ...input, taxOffice: event.target.value });
                    }}
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText}`}>Telefon Numarası</p>
                  <input
                    className={`${styles.inputTag}`}
                    type="text"
                    value={input.tel}
                    placeholder={"Telefon Numarası"}
                    maxLength="15"
                    required
                    onInput={(event) => {
                      setInput({ ...input, tel: event.target.value });
                    }}
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText}`}>Email</p>
                  <input
                    className={`${styles.inputTag}`}
                    type="text"
                    value={input.email}
                    placeholder={"Email"}
                    maxLength="30"
                    required
                    onInput={(event) => {
                      setInput({ ...input, email: event.target.value });
                    }}
                  />
                </div>
                <div className=" flex flex-col justify-between">
                  <p className={`${styles.tagText}`}>Şehir</p>
                  <DropDown
                    options={CityOptions}
                    value={{
                      label: input.address.city,
                      value: input.address.city,
                    }}
                    DropDownPanel={styles.DropDownPanel}
                    text={styles.DropDownText}
                    onChange={handleSelectCity}
                    search={true}
                    barValue={"Şehir"}
                  />
                </div>
                <div className=" flex flex-col justify-between">
                  <p className={`${styles.tagText}`}>İlçe</p>
                  <DropDown
                    options={TownOptions}
                    value={{
                      label: input.address.town,
                      value: input.address.town,
                    }}
                    DropDownPanel={styles.DropDownPanel}
                    text={styles.DropDownText}
                    onChange={handleSelectTown}
                    search={true}
                    barValue={"İlçe"}
                  />
                </div>
              </div>
              <div className=" grid sm:grid-cols-2 grid-cols-1 gap-10 h-fit">
                <div>
                  <p className={`${styles.tagText}`}>Adres</p>
                  <textarea
                    className={`${styles.inputTag}`}
                    value={input.address.text}
                    maxLength="100"
                    onChange={(event) => {
                      setInput({
                        ...input,
                        address: {
                          town: input.address.town,
                          text: event.target.value,
                          city: input.address.city,
                        },
                      });
                    }}
                  />
                </div>

                <div>
                  <p className={`${styles.tagText}`}>Açıklama</p>
                  <textarea
                    className={`${styles.inputTag} h-48`}
                    value={input.note}
                    maxLength="100"
                    onChange={(e) => {
                      var string = e.target.value;
                      setInput({ ...input, note: string });
                    }}
                  />
                </div>
              </div>
              <button
                onClick={() => {}}
                className={`${styles.button}  self-end`}
              >
                <IoMdAddCircle className={`${styles.buttonIcon}`} />
                <p>Ekle</p>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="fixed bottom-0 ">
        <div
          style={{ height: "70px" }}
          className="w-screen  bg-fourth flex justify-center items-center"
        ></div>
      </div>
    </div>
  );
}

export default CreateFirmPage;
