import { useEffect, useState } from "react";
import styles from "../../../../CustomStyles";

function DataSearchBar({ Data, handleSearch }) {
  const [input, setInput] = useState("");
  const [clean, setClean] = useState(false);

  let filteredData = [];

  const cleanBar = () => {
    setClean(true);
    setInput({
      ...input,
      typeName: "",
      name: "",
    });
  };

  useEffect(() => {
    if (clean === false) {
      if (input.name === undefined || input.name === "") {
        setClean(true);
        filteredData = Data;
      } else {
        filteredData = Data?.filter((Data) => {
          //return the item which contains the user input

          if (
            input.name === undefined
              ? true
              : Data?.name.toLowerCase().includes(input.name.toLowerCase())
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
          className={`${styles.inputTag}`}
          value={input.name}
          maxLength="40"
          autoFocus="autoFocus"
          placeholder="İsmi"
          onChange={(e) => {
            var value = e.target.value;
            setInput({ ...input, name: value });
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
