import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import DropDown from "../../../components/DropDown";
import { Blocks } from "react-loader-spinner";
import Alerts from "../../../components/Alert";
// Icon
import { IoMdSave } from "react-icons/io";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";
import { GiConfirmed, GiCancel } from "react-icons/gi";

import {
  useFetchCityQuery,
  useFetchFirmQuery,
  useFetchTownQuery,
  useGetFirmByIDQuery,
  useUpdateFirmInfoMutation,
} from "../../../store";
import styles from "../../../CustomStyles";

function UpdateInfo() {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const { id } = useParams();

  const [alert, setAlert] = useState(0); // 1- success 2-error 3-warning
  const [message, setMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const ResultFirms = useFetchFirmQuery(token);
  const CityResult = useFetchCityQuery(token);
  const TownResult = useFetchTownQuery(token);
  const ResultMainFirm = useGetFirmByIDQuery({ id, token });
  const [update, resultUpdate] = useUpdateFirmInfoMutation();

  const Data = ResultMainFirm?.data?.data?.firm || [];
  const City = CityResult?.data?.data?.cities;
  const Town = TownResult?.data?.data?.towns;
  const MainFirms = ResultFirms?.data?.data?.Firms || [];
  const [input, setInput] = useState({
    name: "",
    mainFirmID: "",
    mainFirmName: "",
    isActive: "",
    officialID: "",
    taxNumber: "",
    taxOffice: "",
    isCorporate: "",
    tel: "",
    email: "",
    address: { city: "", town: "", text: "" },
    playMakers: [],
    token: token,
  });
  const PlayMaker = [
    { _id: "2214", name: "Osman Talha" },
    { _id: "21244", name: "Taha" },
    { _id: "12436", name: "Muhammed Sami" },
    { _id: "4574", name: "Selman Nuri" },
    { _id: "5436", name: "Ali Osman" },
    { _id: "3457", name: "Ahmet Taşer" },
  ];
  const [playMaker, setplayMaker] = useState({ name: "", id: "" });

  useEffect(() => {
    if (ResultMainFirm.status === "fulfilled")
      setInput({ ...Data, token: token });
  }, [ResultMainFirm]);

  useEffect(() => {
    if (alert !== 0) {
      setTimeout(() => {
        setAlert(0);
        setMessage("");
      }, 2000);
    }
  }, [alert]);

  useEffect(() => {
    if (resultUpdate.isError === true) {
      setAlert(2);
      setMessage("İşlem başarısız tekrar deneyin !");
      setInput({
        ...Data,
        token: token,
      });
    }
    if (resultUpdate.isSuccess === true) {
      setAlert(1);
      setMessage("İşlem başarı ile gerçekleşti !");
    }
  }, [resultUpdate.isSuccess, resultUpdate.isError]);

  const handleUpdate = () => {
    if (input.isCorporate === false && input.mainFirmID === "") {
      setAlert(2);
      setMessage(
        "Ana firma olmayan bir firma, başka bir firmaya bağlı olmak zorundadır !"
      );
      setShowConfirmModal(false);
    } else {
      update(input);
      setShowConfirmModal(false);
    }
  };
  const handleCloseModel = (bool) => {
    setShowConfirmModal(false);
  };
  const handleOpenModal = () => {
    setShowConfirmModal(true);
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
    if (data._id !== input._id) return { label: data.name, value: data.name };
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
  const PlayMakerOptions = PlayMaker?.map((data) => {
    return { label: data.name, value: data.name };
  });
  const handleSelectPlayMaker = (option) => {
    PlayMaker?.map((data) => {
      if (option.value === data.name) {
        setplayMaker({ id: data._id, name: data.name });
      }
    });
  };

  return (
    <div>
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
        className={`z-50 flex items-center fixed justify-center ${
          showConfirmModal ? "flex" : "hidden"
        } w-full h-full bg-opacity-50 transition-all duration-100`}
      >
        <div
          onClick={() => handleCloseModel(false)}
          className="fixed inset-0 bg-gray-300 opacity-80 "
        ></div>
        <div className=" flex z-10 flex-col gap-3 bg-slate-600  mx-auto w-fit p-1 rounded-xl fixed top-1/2  -translate-y-1/2 left-1/2 -translate-x-1/2">
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
              <text className={`${styles.tagText}`}>Anafirma: </text>
              <text>{input.isCorporate ? "Evet" : "Hayır"}</text>
            </div>
            <div>
              <text className={`${styles.tagText}`}>Tc NO: </text>
              <text>{input.officialID}</text>
            </div>
            <div>
              <text className={`${styles.tagText}`}>Vergi Numarası: </text>
              <text>{input.taxNumber}</text>
            </div>
            <div>
              <text className={`${styles.tagText}`}>Vergi Dairesi: </text>
              <text>{input.taxOffice}</text>
            </div>
            <div>
              <text className={`${styles.tagText}`}>Telefon: </text>
              <text>{input.tel}</text>
            </div>
            <div>
              <text className={`${styles.tagText}`}>Email: </text>
              <text>{input.email}</text>
            </div>
            <div className="flex gap-2 items-center justify-center">
              <button
                onClick={handleUpdate}
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
      <div className="flex flex-col md:flex-row border-b-4 border-fourth w-full h-fit mb-4">
        <text className="flex items-center font-SemiBold tracking-wider  self-center w-full mb-2">
          <p className={`xl:text-2xl md:text-XL text-BASE tracking-wider`}>
            Firma Bilgileri
          </p>
          /
          <p className={`xl:text-2xl md:text-XL text-BASE tracking-wider`}>
            Aktiflik:
          </p>
          <button
            className={`${
              input.isActive ? "bg-sixth" : "bg-fifth"
            } w-6 h-6 text-center ml-3 rounded-full border-2 border-fourth transition-all duration-200 hover:scale-110`}
            checked={input.isActive}
            onClick={() => {
              const active = !input.isActive;
              setInput({ ...input, isActive: active });
            }}
          />
        </text>
        <div className="flex items-center justify-center w-full mb-2">
          <p className={`${styles.DesignFieldHeader} w-full`}>
            Oluşturulma Tarihi :
          </p>
          <p className={`${styles.DesignFieldHeader} w-full`}>
            {input.createdInfo}
          </p>
        </div>
        <div className="flex items-center justify-center w-full mb-2">
          <p className={`${styles.DesignFieldHeader} w-full`}>
            Değiştirilme Tarihi :
          </p>
          <p className={`${styles.DesignFieldHeader} w-full`}>
            {input.updatedInfo}
          </p>
        </div>
      </div>
      {ResultMainFirm.isFetching || resultUpdate.isLoading ? (
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleOpenModal();
          }}
          className=" flex flex-col gap-4 bg-white shadow-md  rounded-lg  p-8 h-fit transition-all duration-300"
        >
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10 h-fit">
            <div
              className={` ${
                input.isCorporate ? "hidden" : "flex"
              }  flex-col justify-between`}
            >
              <p className={`${styles.tagText}`}>Ana Firma</p>
              <DropDown
                options={MainFirmOptions}
                value={{
                  label: input.mainFirmName,
                  value: input.mainFirmName,
                }}
                text={styles.DropDownText}
                DropDownPanel={styles.DropDownPanel}
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
                text={styles.DropDownText}
                DropDownPanel={styles.DropDownPanel}
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
                text={styles.DropDownText}
                DropDownPanel={styles.DropDownPanel}
                onChange={handleSelectTown}
                search={true}
                barValue={"İlçe"}
              />
            </div>
          </div>
          <div className=" grid lg:grid-cols-2 grid-cols-1 gap-10 h-fit">
            <div className=" flex flex-col">
              <text className={`${styles.tagText}`}>Plasiyer</text>
              <div className=" flex gap-4">
                <div className="w-full z-30">
                  <DropDown
                    options={PlayMakerOptions}
                    value={{
                      label: playMaker.name,
                      value: playMaker.name,
                    }}
                    text={styles.DropDownText}
                    DropDownPanel={styles.DropDownPanel}
                    onChange={handleSelectPlayMaker}
                    search={true}
                    barValue={"Plasiyer"}
                  />
                </div>
                <AiOutlinePlusCircle
                  onClick={() => {
                    if (
                      !input?.playMakers?.find(
                        (item) => item.id === playMaker.id
                      ) &&
                      input?.playMakers?.length <= 3 &&
                      playMaker.name !== "" &&
                      playMaker.id !== ""
                    ) {
                      setInput({
                        ...input,
                        playMakers: [
                          ...input.playMakers,
                          { id: playMaker.id, name: playMaker.name },
                        ],
                      });
                    }
                    setplayMaker({ id: "", name: "" });
                  }}
                  className=" w-12 h-12 text-slate-600 cursor-pointer active:text-primary"
                />
              </div>
            </div>
            <div className=" grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2 pr-16 items-center">
              {input?.playMakers?.map((item) => {
                return (
                  <div className="bg-slate-200 rounded-xl p-2 text-center relative h-fit lg:mt-6 mt-0">
                    <p className=" break-words py-2">{item.name}</p>
                    <span class="flex h-5 w-5 absolute -top-1 -right-1">
                      <span class="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-sky-400 opacity-75"></span>
                      <div
                        onClick={() => {
                          const updatedPlaymakers = input?.playMakers?.filter(
                            (index) => index.name !== item.name
                          );
                          setInput({
                            ...input,
                            playMakers: updatedPlaymakers,
                          });
                        }}
                        className="cursor-pointer"
                      >
                        <RxCrossCircled className=" relative inline-flex rounded-full h-5 w-5 bg-sky-500 active:bg-fifth" />
                      </div>
                    </span>
                  </div>
                );
              })}
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
                className={`${styles.inputTag}`}
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
            className={`${styles.button} w-fit self-end`}
          >
            <IoMdSave className={`${styles.buttonIcon}`} />
            <p>Kaydet</p>
          </button>
        </form>
      )}
    </div>
  );
}

export default UpdateInfo;
