import { AiOutlineUpload } from "react-icons/ai";
import { ImQrcode } from "react-icons/im";
import styles from "../../../CustomStyles";
function UpdateQuota() {
  return (
    <div
      className="flex flex-col bg-white w-fit
    self-center shadow-xl p-6 gap-4 rounded-xl justify-center items-center"
    >
      <div
        className={`${styles.DesignFieldHeader} text-center border-b-4 w-full border-fourth`}
      >
        Bu Sayfa GSM Testi İle Aktif Olacak
      </div>
      <div className=" flex flex-col gap-2 text-white">
        <div className=" flex items-center bg-fourth px-4 py-2 rounded-full">
          <p className={`${styles.textTitle}`}>Firma:</p>
          <p className={`ml-4 ${styles.text}`}>Bayıner</p>
        </div>
        <div className=" flex items-center bg-fourth px-4 py-2 rounded-full">
          <p className={` ${styles.textTitle}`}>Firma Bakiyesi:</p>
          <p className={`ml-4 ${styles.text}`}>240</p>
        </div>
      </div>
      <div className=" flex flex-col  w-fit p-6 gap-4 rounded-xl">
        <div
          className={`${styles.DesignFieldHeader} text-center border-b-4 w-full border-fourth`}
        >
          Cihaz Kota Yükleme
        </div>

        <div className=" grid md:grid-cols-2 grid-cols-1 gap-4">
          <div className="flex flex-col items-center justify-between px-4 py-4 rounded-xl gap-4">
            <div className=" flex flex-col gap-2">
              <p className={`${styles.textTitle} text-center`}>Cihaz Kodu</p>
              <input value={0} className={`${styles.inputTag} text-center`} />
            </div>
            <div className=" flex flex-col gap-2">
              <p className={`${styles.textTitle} text-center`}>Sayaç</p>
              <input value={0} className={`${styles.inputTag} text-center`} />
            </div>
            <div className=" flex flex-col gap-2">
              <p className={`${styles.textTitle} text-center`}>
                Yüklenecek Kota
              </p>
              <input value={0} className={`${styles.inputTag} text-center`} />
            </div>

            <div>
              <input
                value={"AVBASDXZDS"}
                disabled
                className={` text-center rounded-xl p-2 w-fit cursor-pointer bg-green-200`}
              />
            </div>
            <button className={`${styles.button} py-4`}>
              <p className=" ">Kod Üret</p>
              <ImQrcode
                className={`${styles.buttonIcon} ${true ? "animate-spin" : ""}`}
              />
            </button>
          </div>
          <div className="flex flex-col items-center justify-between px-4 py-4 rounded-xl gap-4">
            <div className="grid grid-cols-1">
              <div className=" flex flex-col gap-2 items-center justify-center  px-4 py-2 rounded-full">
                <p className={`${styles.textTitle} text-center`}>
                  Kalan Miktar
                </p>
                <input
                  value={430}
                  className={`${styles.inputTag} text-center`}
                  disabled
                />
              </div>
              <div className=" flex flex-col gap-2 items-center justify-center  px-4 py-2 rounded-full">
                <p className={`${styles.textTitle} text-center`}>
                  Tüketilen Miktar
                </p>
                <input
                  value={240}
                  className={`${styles.inputTag} text-center`}
                  disabled
                />
              </div>
              <div className=" flex flex-col gap-2 items-center justify-center  px-4 py-2 rounded-full">
                <p className={`${styles.textTitle} text-center`}>
                  Yüklenecek Kota
                </p>
                <input
                  value={0}
                  className={`${styles.inputTag} text-center`}
                  disabled
                />
              </div>
            </div>
            <button className={`${styles.button} py-4`}>
              <p>Kota Yükle</p>
              <AiOutlineUpload className={`${styles.buttonIcon}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateQuota;
