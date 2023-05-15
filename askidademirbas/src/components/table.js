import { Fragment } from "react";

export default function Table({ data, config, keyFn }) {
  const headerTextStyle = "xl:text-XL text-BASE  px-2 py-3";
  const textStyle = "xl:text-BASE text-SM max-sm:text-BASE px-2 py-3";
  const renderedHeaders = config.map((column) => {
    if (column.header) {
      return <Fragment key={column.label}>{column.header()}</Fragment>;
    }

    return <th key={column.label}>{column.label}</th>;
  });

  const renderedRows = data?.map((rowData) => {
    const renderedCells = config.map((column) => {
      return (
        <td
          className={` ${textStyle}  font-medium  max-md:grid md:text-center `}
          key={column.label}
        >
          {column.render(rowData)}
        </td>
      );
    });
    return (
      <tr
        className="odd:bg-slate-200 hover:scale-105 cursor-pointer transition-all duration-300 shadow-2xl text-black bg-transparent md:shadow-lg"
        key={keyFn(rowData)}
      >
        {renderedCells}
      </tr>
    );
  });

  return (
    <table className=" w-full h-fit divide-y">
      <thead
        className={` ${headerTextStyle} text-center md:border-b-2 max-md:hidden `}
      >
        <tr className="">{renderedHeaders}</tr>
      </thead>
      <tbody className=" relative max-md:flex max-md:flex-col rounded-xl gap-4">
        {renderedRows}
      </tbody>
    </table>
  );
}
