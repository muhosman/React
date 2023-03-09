import { useEffect, useState } from "react";
import styles from "../../../CustomStyles";
function DataSearchBar({ Data, handleSearch }) {
  const [input, setInput] = useState({ role: "", billNo: "" });
  const [clean, setClean] = useState(false);
  let filteredData = [];
  const cleanBar = () => {
    setClean(true);
    setInput({
      ...input,
      firmName: "",
      billNo: "",
      productName: "",
    });
  };

  useEffect(() => {
    if (clean === false) {
      if (
        (input.productName === undefined || input.productName === "") &&
        (input.billNo === undefined || input.billNo === "")
      ) {
        setClean(true);
        filteredData = Data;
      } else {
        filteredData = Data?.filter((Data) => {
          //return the item which contains the user input
          console.log(Data.firmName);
          if (
            (input.billNo === undefined
              ? true
              : Data?.billNo
                  ?.toLowerCase()
                  .includes(input.billNo?.toLowerCase())) &&
            (input.productName === undefined
              ? true
              : Data?.productName
                  ?.toLowerCase()
                  .includes(input.productName?.toLowerCase()))
          ) {
            return true;
          } else {
            return false;
          }
        });
      }
      if (clean === false) {
        handleSearch(filteredData, true);
      }
    }
    if (clean === true) {
      handleSearch("", false);
    }
    setClean(false);
  }, [input]);

  return (
    <div className="flex gap-3 flex-col w-full text-xs xl:text-sm 2xl:text-base">
      <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3 items-center">
        <input
          className={`${styles.inputSearch}`}
          maxLength="40"
          value={input.billNo}
          autoFocus="autoFocus"
          placeholder="Fatura Numarası"
          onChange={(e) => {
            var value = e.target.value;
            setInput({ ...input, billNo: value });
          }}
        />
        <input
          className={`${styles.inputSearch}`}
          value={input.productName}
          maxLength="40"
          autoFocus="autoFocus"
          placeholder="Ürün İsmi"
          onChange={(e) => {
            var value = e.target.value;
            setInput({ ...input, productName: value });
          }}
        />
      </div>
      <div className="flex justify-end gap-4">
        <button className={`${styles.buttonSearch}`} onClick={cleanBar}>
          Temizle
        </button>
      </div>
    </div>
  );
}

export default DataSearchBar;
