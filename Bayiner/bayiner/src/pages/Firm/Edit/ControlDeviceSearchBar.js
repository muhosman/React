import { useEffect, useState } from "react";
import styles from "../../../CustomStyles";
function DataSearchBar({ Data, handleSearch }) {
  const [input, setInput] = useState({ role: "", name: "" });
  const [clean, setClean] = useState(false);
  let filteredData = [];
  const cleanBar = () => {
    setClean(true);
    setInput({
      ...input,
      firmName: "",
      name: "",
      ip: "",
    });
  };

  useEffect(() => {
    if (clean === false) {
      if (
        (input.ip === undefined || input.ip === "") &&
        (input.name === undefined || input.name === "")
      ) {
        setClean(true);
        filteredData = Data;
      } else {
        filteredData = Data?.filter((Data) => {
          //return the item which contains the user input
          console.log(Data.firmName);
          if (
            (input.name === undefined
              ? true
              : Data?.name
                  ?.toLowerCase()
                  .includes(input.name?.toLowerCase())) &&
            (input.ip === undefined
              ? true
              : Data?.ip?.toLowerCase().includes(input.ip?.toLowerCase()))
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
          value={input.name}
          autoFocus="autoFocus"
          placeholder="Cihaz Tipi"
          onChange={(e) => {
            var value = e.target.value;
            setInput({ ...input, name: value });
          }}
        />
        <input
          className={`${styles.inputSearch}`}
          value={input.ip}
          maxLength="40"
          autoFocus="autoFocus"
          placeholder="IP Numarası"
          onChange={(e) => {
            var value = e.target.value;
            setInput({ ...input, ip: value });
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
