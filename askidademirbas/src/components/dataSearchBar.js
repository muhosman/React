import { useEffect, useState } from "react";

export default function DataSearchBar({ Data, handleSearch, inputFieldName }) {
  const [input, setInput] = useState({});
  const [clean, setClean] = useState(false);

  let filteredData = [];

  const cleanBar = () => {
    setClean(true);
    setInput({});
  };

  useEffect(() => {
    if (clean === false) {
      filteredData = Data?.filter((Data) => {
        let include = true;
        Object.entries(input).forEach(([key, value]) => {
          if (
            value &&
            !Data[key]?.toString().toLowerCase().includes(value.toLowerCase())
          ) {
            include = false;
          }
        });
        return include;
      });

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
        {Object.entries(inputFieldName).map(([key, value]) => {
          return (
            <input
              key={key}
              value={input[key] ?? ""}
              maxLength="40"
              autoFocus="autoFocus"
              placeholder={value}
              onChange={(e) => {
                var newValue = e.target.value;
                setInput((prevInput) => ({ ...prevInput, [key]: newValue }));
              }}
            />
          );
        })}
      </div>
      <div className="flex justify-end gap-4">
        <button onClick={cleanBar}>Temizle</button>
      </div>
    </div>
  );
}
