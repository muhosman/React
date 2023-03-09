import { useEffect, useState } from "react";
import styles from "../../CustomStyles";
function DataSearchBar({ Data, handleSearch }) {
  const [input, setInput] = useState({ bayserNo: "", name: "" });
  const [clean, setClean] = useState(false);
  let filteredData = [];
  const cleanBar = () => {
    setClean(true);
    setInput({
      ...input,
      bayserNo: "",
      name: "",
      mainFirmName: "",
    });
  };

  useEffect(() => {
    if (clean === false) {
      if (
        (input.bayserNo === undefined || input.bayserNo === "") &&
        (input.name === undefined || input.name === "") &&
        (input.mainFirmName === undefined || input.mainFirmName === "")
      ) {
        setClean(true);
        filteredData = Data;
      } else {
        filteredData = Data?.filter((Data) => {
          //return the item which contains the user input
          console.log(
            input.name === undefined
              ? true
              : Data?.name.toLowerCase().includes(input.name.toLowerCase())
          );
          if (
            (input.name === undefined
              ? true
              : Data?.name.toLowerCase().includes(input.name.toLowerCase())) &&
            (input.bayserNo === undefined
              ? true
              : Data?.bayserNo
                  .toLowerCase()
                  .includes(input.bayserNo.toLowerCase())) &&
            (input.mainFirmName === undefined
              ? true
              : Data?.mainFirmName
                  ?.toLowerCase()
                  .includes(input.mainFirmName?.toLowerCase()))
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
          autoFocus="autoFocus"
          placeholder="Kullanıcı İsmi"
          onChange={(e) => {
            var value = e.target.value;
            setInput({ ...input, name: value });
          }}
        />
        <input
          className={`${styles.inputSearch}`}
          value={input.mainFirmName}
          maxLength="40"
          autoFocus="autoFocus"
          placeholder="Ana Firma İsmi"
          onChange={(e) => {
            var value = e.target.value;
            setInput({ ...input, mainFirmName: value });
          }}
        />
        <input
          className={`${styles.inputSearch}`}
          value={input.bayserNo}
          maxLength="40"
          autoFocus="autoFocus"
          placeholder="Bayser Numarası"
          onChange={(e) => {
            var value = e.target.value;
            setInput({ ...input, bayserNo: value });
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
