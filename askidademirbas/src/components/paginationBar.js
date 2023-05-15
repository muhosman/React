import {
  BiChevronRight,
  BiChevronsRight,
  BiChevronLeft,
  BiChevronsLeft,
} from "react-icons/bi";

export default function PaginationBar({
  elements,
  information,
  paginationNumber,
  setPaginationNumber,
}) {
  var length = Math.round((elements?.length || 1) / 10);
  var arr = [];

  if (elements?.length > length * 10 && !(elements?.length % 10 === 0))
    length += 1;
  for (let i = 1; i < length + 1; i++) arr.push(i);

  const statement = arr.map((pagNumber) => {
    if (pagNumber >= paginationNumber - 2 && pagNumber <= paginationNumber + 2)
      return (
        <button
          className={
            pagNumber === paginationNumber
              ? "bg-slate-800  px-3 rounded-xl hover:bg-slate-600 text-white"
              : "px-2 rounded-xl border-1 border-2 border-white hover:border-slate-800 "
          }
          key={pagNumber}
          value={pagNumber}
          onClick={() => setPaginationNumber(pagNumber)}
        >
          <p> {pagNumber}</p>
        </button>
      );
    else {
    }
  });
  if (paginationNumber === 1) {
    if (statement.length == 0) {
      return (
        <div className="flex items-center gap-2">
          <div className="flex gap-1">{information}</div>
        </div>
      );
    }
    if (statement.length == 1) {
      return (
        <div className="flex items-center gap-2">
          <div className="flex gap-1">{statement}</div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <div className="flex gap-1">{statement}</div>
          <button onClick={() => setPaginationNumber(paginationNumber + 1)}>
            <BiChevronRight />
          </button>
          <button onClick={() => setPaginationNumber(length)}>
            <BiChevronsRight />
          </button>
        </div>
      );
    }
  } else if (paginationNumber === statement.length) {
    return (
      <div className="flex flex-row gap-2">
        <button onClick={() => setPaginationNumber(1)}>
          <BiChevronsLeft />
        </button>
        <button onClick={() => setPaginationNumber(paginationNumber - 1)}>
          <BiChevronLeft />
        </button>
        <div className="flex gap-1">{statement}</div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-row gap-2">
        <button onClick={() => setPaginationNumber(1)}>
          <BiChevronsLeft />
        </button>
        <button onClick={() => setPaginationNumber(paginationNumber - 1)}>
          <BiChevronLeft />
        </button>
        <div className="flex gap-1">{statement}</div>
        <button onClick={() => setPaginationNumber(paginationNumber + 1)}>
          <BiChevronRight />
        </button>
        <button onClick={() => setPaginationNumber(length)}>
          <BiChevronsRight />
        </button>
      </div>
    );
  }
}
