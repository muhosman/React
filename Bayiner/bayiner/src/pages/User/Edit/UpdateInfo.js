import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Icons
import { IoMdAddCircle } from "react-icons/io";
import { GiConfirmed, GiCancel } from "react-icons/gi";

import useAuth from "../../../hooks/useAuth";
import Alerts from "../../../components/Alert";
import { Blocks } from "react-loader-spinner";
import DropDown from "../../../components/DropDown";
import styles from "../../../CustomStyles";
import {
  useFetchFirmQuery,
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../../store";

function UpdateInfo() {
  const text = "";

  const { auth } = useAuth();
  const token = auth.accessToken;
  const { id } = useParams();

  const ResultUser = useGetUserQuery({ id, token });
  const [update, resultUpdate] = useUpdateUserMutation();
  const [alert, setAlert] = useState(0); // 1- success 2-error 3-warning
  const [message, setMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const Data = ResultUser?.data?.data?.user || [];
  const MainFirmData = useFetchFirmQuery(token);
  const MainFirms = MainFirmData?.data?.data?.Firms || [];
  const RoleOptions = [
    { label: "Yönetici", value: "Yönetici" },
    { label: "Muhasebe", value: "Muhasebe" },
    { label: "Üretim", value: "Üretim" },
    { label: "Plasiyer", value: "Plasiyer" },
    { label: "Müşteri", value: "Müşteri" },
    { label: "Müşteri Çalışanı", value: "Müşteri Çalışanı" },
  ];

  const [input, setInput] = useState({
    role: "",
    firmID: "",
    firmName: "",
    name: "",
    lastName: "",
    email: "",
    tel: "",
    token: token,
  });
  const [role, setRole] = useState("");

  useEffect(() => {
    if (ResultUser.status === "fulfilled") {
      setInput({ ...Data, token: token });

      const rl =
        input.role === "playmaker"
          ? "Plasiyer"
          : input.role === "admin"
          ? "Yönetici"
          : input.role === "accounting"
          ? "Muhasebe"
          : input.role === "manufacturer"
          ? "Üretim"
          : input.role === "firm"
          ? "Müşteri"
          : input.role === "worker"
          ? "Müşteri Çalışanı"
          : "";
      setRole(rl);
    }
  }, [ResultUser]);

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
    }
    if (resultUpdate.isSuccess === true) {
      setAlert(1);
      setMessage("İşlem başarı ile gerçekleşti !");
    }
  }, [resultUpdate.isSuccess, resultUpdate.isError]);

  const handleOpenModal = async (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleCloseModel = (bool) => {
    setShowConfirmModal(false);
  };

  const handleUpdate = () => {
    update(input);
    console.log(input);
    setShowConfirmModal(false);
  };

  const handleSelectRole = (option) => {
    RoleOptions?.map((data) => {
      if (option.value === data.value) {
        const rl =
          data.value === "Plasiyer"
            ? "playmaker"
            : option.value === "Yönetici"
            ? "admin"
            : option.value === "Muhasebe"
            ? "accounting"
            : option.value === "Üretim"
            ? "manufacturer"
            : option.value === "Müşteri"
            ? "firm"
            : option.value === "Müşteri Çalışanı"
            ? "worker"
            : "";
        setInput({
          ...input,
          role: rl,
        });
        setRole(option.value);
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
          firmID: data._id,
          firmName: data.name,
        });
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
        className={`z-50 flex items-center justify-center absolute ${
          showConfirmModal ? "flex" : "hidden"
        } w-full h-full bg-opacity-50 transition-all duration-100`}
      >
        <div
          onClick={() => handleCloseModel(false)}
          className="fixed inset-0 bg-gray-300 opacity-80 "
        ></div>
        <div className=" flex z-10 flex-col gap-3 bg-slate-600  mx-auto w-fit p-1 rounded-xl fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <div className="bg-white rounded-xl p-4 flex flex-col gap-5">
            <div className="flex gap-2">
              <text className="font-Bold">İsim:</text>
              <text>{input.name}</text>
            </div>
            <div>
              <text className="font-Bold">Soyisim: </text>
              <text>{input.lastName ? "Ana Firma" : "Şube"}</text>
            </div>
            <div>
              <text className="font-Bold">Firma İsmi: </text>
              <text>{input.firmName}</text>
            </div>
            <div>
              <text className="font-Bold">Email: </text>
              <text>{input.email}</text>
            </div>
            <div>
              <text className="font-Bold">Telefon: </text>
              <text>{input.tel}</text>
            </div>
            <div>
              <text className="font-Bold">Rol: </text>
              <text>{input.role}</text>
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

      {/*
      Device information.
      */}
      {resultUpdate.isLoading ? (
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
            className={`flex mb-20 flex-col overflow-y-scroll no-scrollbar justify-between`}
          >
            <div className="flex flex-col items-center md:flex-row border-b-4 border-fourth w-full mb-6 pb-2">
              <p className={`${styles.DesignFieldHeader}`}>
                Kullanıcı Bilgileri
              </p>
              /<p className={`${styles.DesignFieldHeader}`}>Aktiflik:</p>
              <div
                className={`${
                  input.isActive ? "bg-sixth" : "bg-fifth"
                } w-6 h-6 text-center ml-3 cursor-pointer rounded-full border-2 border-fourth transition-all duration-200 hover:scale-110`}
                checked={input.isActive}
                onClick={() => {
                  const active = !input.isActive;
                  setInput({ ...input, isActive: active });
                }}
              />
            </div>
            <div className=" flex flex-col gap-4 bg-white rounded-lg shadow-xl p-8 h-fit">
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 h-fit">
                <div
                  className={`  flex
                    flex-col  `}
                >
                  <p className={`${styles.tagText}`}>Rol</p>
                  <DropDown
                    options={RoleOptions}
                    value={{
                      label: role,
                      value: role,
                    }}
                    text={styles.DropDownText}
                    DropDownPanel={styles.DropDownPanel}
                    onChange={handleSelectRole}
                    search={true}
                    barValue={"Rol"}
                  />
                </div>
                <div
                  className={`  flex
                    flex-col`}
                >
                  <p className={`${styles.tagText}`}>Firma</p>
                  <DropDown
                    options={MainFirmOptions}
                    value={{
                      label: input.firmName,
                      value: input.firmName,
                    }}
                    text={styles.DropDownText}
                    DropDownPanel={styles.DropDownPanel}
                    onChange={handleSelectMainFirm}
                    search={true}
                    barValue={"Ana Firma"}
                  />
                </div>

                <div>
                  <p className={`${styles.tagText}`}>İsim</p>
                  <input
                    className={`${styles.inputTag}`}
                    type="text"
                    value={input.name}
                    placeholder={"İsim"}
                    maxLength="30"
                    required
                    onInput={(event) => {
                      setInput({ ...input, name: event.target.value });
                    }}
                  />
                </div>
                <div>
                  <p className={`${styles.tagText}`}>Soyisim</p>
                  <input
                    className={`${styles.inputTag}`}
                    type="text"
                    value={input.lastName}
                    placeholder={"Soyisim"}
                    maxLength="30"
                    required
                    onInput={(event) => {
                      setInput({ ...input, lastName: event.target.value });
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
                    disabled
                  />
                </div>
              </div>
              <button
                onClick={() => {}}
                className={`${styles.button} transition-all duration-300 active:scale-90 self-end`}
              >
                <IoMdAddCircle className={`${styles.buttonIcon}`} />
                <p>Kaydet</p>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default UpdateInfo;
