import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Blocks } from "react-loader-spinner";
import Alerts from "../../../components/Alert";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { useDeleteUserByIDMutation } from "../../../store";
import styles from "../../../CustomStyles";
function Delete() {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const { id } = useParams();
  const [alert, setAlert] = useState(0); // 1- success 2-error 3-warning
  const [message, setMessage] = useState("");
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const [deleteFirm, resultDelete] = useDeleteUserByIDMutation();

  useEffect(() => {
    setInput({
      id: id,
      token: token,
      password: " ",
      passwordConfirm: " ",
    });
  }, []);
  const handleDelete = (event) => {
    event.preventDefault();
    deleteFirm(input);
  };

  useEffect(() => {
    if (alert !== 0) {
      setTimeout(() => {
        if (alert === 1) {
          setAlert(0);
          setMessage("");
          navigate("/Anasayfa/users");
        }
        setAlert(0);
        setMessage("");
      }, 2000);
    }
  }, [alert]);

  useEffect(() => {
    if (resultDelete.isError === true) {
      setAlert(2);
      setMessage("İşlem başarısız tekrar deneyin !");
    }
    if (resultDelete.isSuccess === true) {
      setAlert(1);
      setMessage("İşlem başarı ile gerçekleşti !");
    }
  }, [resultDelete.isSuccess, resultDelete.isError]);

  return (
    <div className=" flex flex-col bg-white shadow-md shadow-black w-fit p-6 gap-4 rounded-xl self-center justify-center items-center">
      {alert !== 0 && (
        <div className="fixed z-50 left-1/2 top-0 -translate-x-1/2">
          <Alerts AlertChoice={alert} message={message} />
        </div>
      )}

      {resultDelete.isLoading ? (
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
        <div className=" flex flex-col  w-fit p-6 gap-4 rounded-xl">
          <div className="  text-center border-b-4 border-fourth w-full font-Bold text-2xl">
            Kullanıcı Silme
          </div>
          <div className=" flex gap-4 w-full">
            <form
              onSubmit={handleDelete}
              className="  flex flex-col items-center justify-center px-4 py-4 rounded-xl gap-4"
            >
              <div className=" flex flex-col  gap-2">
                <div className="flex gap-2 items-center">
                  <RiLockPasswordLine className={`${styles.tagIcon}`} />
                  <p className={`${styles.tagText}`}>Şifre</p>
                </div>

                <input
                  type="password"
                  required
                  value={input.password}
                  className={`${styles.inputTag}`}
                  onInput={(event) => {
                    setInput({ ...input, password: event.target.value });
                  }}
                />
              </div>
              <div className=" flex flex-col  gap-2">
                <div className="flex gap-2 items-center">
                  <RiLockPasswordLine className={`${styles.tagIcon}`} />
                  <p className={`${styles.tagText}`}>Şifre Onay</p>
                </div>
                <input
                  required
                  type="password"
                  value={input.passwordConfirm}
                  className={`${styles.inputTag}`}
                  onInput={(event) => {
                    setInput({ ...input, passwordConfirm: event.target.value });
                  }}
                />
              </div>

              <button className={`${styles.button}`}>
                <p className=" ">Kullanıcı Sil</p>
                <MdOutlineDeleteOutline
                  className={`${styles.buttonIcon} ${
                    true ? "animate-bounce" : ""
                  }`}
                />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Delete;
