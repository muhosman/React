import styles from "../CustomStyles";

function Confirm({
  input,
  inputFieldName,
  handleCloseModel,
  showConfirmModal,
}) {
  return (
    <>
      <div
        className={`z-50 flex items-center justify-center absolute ${
          showConfirmModal ? "flex" : "hidden"
        } w-full h-full bg-opacity-50 transition-all duration-100`}
      >
        <div
          onClick={() => handleCloseModel(false)}
          className="fixed  inset-0 bg-gray-300 opacity-80 "
        ></div>
        <div className="fixed z-10 w-fit left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 border-4 border-fourth rounded-md ">
          <div className=" rounded-md bg-white p-4 flex flex-col gap-5">
            {Object.keys(input).map((key, index) => {
              if (inputFieldName.hasOwnProperty(key)) {
                return (
                  <div key={index}>
                    <text className={`${styles.textTitle} mr-2`}>
                      {inputFieldName[key]}:
                    </text>
                    <text className={`${styles.text}`}>{input[key]}</text>
                  </div>
                );
              }
              return null;
            })}
            <div className="flex gap-2 items-center justify-center">
              <button
                onClick={() => handleCloseModel(true)}
                className={`${styles.buttonSearch}`}
              >
                Onay
              </button>
              <button
                onClick={() => handleCloseModel(false)}
                className={`${styles.buttonSearch}`}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Confirm;
