import { useState, useEffect } from "react";
import { BsPersonPlusFill } from "react-icons/bs";
import { IoMdAddCircle } from "react-icons/io";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { GiConfirmed, GiCancel } from "react-icons/gi";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Alerts from "../../components/Alert";
import { Blocks } from "react-loader-spinner";
import styles from "../../CustomStyles";
import {
  useAddFirmMutation,
  useAddUserMutation,
  useFetchCityQuery,
  useFetchFirmQuery,
  useFetchTownQuery,
} from "../../store";
import DropDown from "../../components/DropDown";

function CreateUserPage() {
  const text = "";

  const { auth } = useAuth();
  const navigate = useNavigate();
  const token = auth.accessToken;

  const [add, resultAdd] = useAddUserMutation();
  const [alert, setAlert] = useState(0); // 1- success 2-error 3-warning
  const [message, setMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const MainFirmData = useFetchFirmQuery(token);

  const MainFirms = MainFirmData?.data?.data?.Firms || [];

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

  useEffect(() => {
    if (alert !== 0) {
      setTimeout(() => {
        if (alert === 1) {
          setAlert(0);
          setMessage("");
          navigate(-1);
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
    add(input);
    setShowConfirmModal(false);
  };

  /** 
    { label: "playmaker", value: "playmaker" },
    { label: "firm", value: "firm" },
    { label: "dealer", value: "dealer" },
    { label: "accounting", value: "accounting" },
    { label: "manufacture", value: "manufacture" }, */
  const RoleOptions = [
    { label: "admin", value: "admin" },
    { label: "management", value: "management" },
  ];
  const handleSelectRole = (option) => {
    RoleOptions?.map((data) => {
      if (option.value === data.value) {
        setInput({
          ...input,
          role: option.value,
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
          firmID: data._id,
          firmName: data.name,
        });
      }
    });
  };

  return (
    <div className="fixed w-screen h-screen top-0 left-0 z-50 bg-white">
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
              <text className={`${styles.textTitle}`}>İsim:</text>
              <text className={`${styles.text}`}>{input.name}</text>
            </div>
            <div>
              <text className={`${styles.textTitle}`}>Soyisim: </text>
              <text className={`${styles.text}`}>
                {input.lastName ? "Ana Firma" : "Şube"}
              </text>
            </div>
            <div>
              <text className={`${styles.textTitle}`}>Firma İsmi: </text>
              <text className={`${styles.text}`}>{input.firmName}</text>
            </div>
            <div>
              <text className={`${styles.textTitle}`}>Email: </text>
              <text className={`${styles.text}`}>{input.email}</text>
            </div>
            <div>
              <text className={`${styles.textTitle}`}>Telefon: </text>
              <text className={`${styles.text}`}>{input.tel}</text>
            </div>
            <div>
              <text className={`${styles.textTitle}`}>Rol: </text>
              <text className={`${styles.text}`}>{input.role}</text>
            </div>

            <div className="flex gap-2 items-center justify-center">
              <button onClick={handleAdd} className={`${styles.buttonSearch}`}>
                Onay
              </button>
              <button
                onClick={handleCloseModel}
                className={`${styles.buttonSearch}`}
              >
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
          <BsPersonPlusFill className={`${styles.PageHeaderIcon}`} />
          <p className={`${styles.PageHeader}`}>Kullanıcı Ekle</p>
        </div>
        <button
          onClick={() => {
            navigate(-1);
          }}
          className={`flex px-8 py-2 transition-all duration-200  text-white
           h-14 z-10 justify-center items-center
          hover:text-fifth w-fit `}
        >
          <MdOutlineKeyboardBackspace
            className={`${styles.PageHeaderExitIcon}`}
          />
        </button>
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
        <div className="flex flex-col  md:m-auto mx-10 bg-background  h-screen gap-6 md:px-16 ">
          <form
            onSubmit={handleOpenModal}
            className={`flex mt-24 mb-20 flex-col overflow-y-scroll no-scrollbar justify-between`}
          >
            <div className="flex flex-col md:flex-row border-b-4 border-fourth w-full mb-4">
              <p className={`${styles.DesignFieldHeader}`}>Firma Bilgileri</p>
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
                      label: input.role,
                      value: input.role,
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
                    onChange={handleSelectMainFirm}
                    search={true}
                    text={styles.DropDownText}
                    DropDownPanel={styles.DropDownPanel}
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
                    placeholder={"Email"}
                    maxLength="30"
                    required
                    onInput={(event) => {
                      setInput({ ...input, email: event.target.value });
                    }}
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

      <div className="fixed bottom-0 ">
        <div
          style={{ height: "70px" }}
          className="w-screen  bg-fourth flex justify-center items-center"
        ></div>
      </div>
    </div>
  );
}

export default CreateUserPage;
