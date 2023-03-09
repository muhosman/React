import { useState } from "react";
import "./Searchbar.css";

function SearchBar({ onSubmit }) {
  const [term, setTerm] = useState("dssf");

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSubmit(term);
  };

  const handleChange = (event) => {
    setTerm(event.target.value);
  };
  return (
    <div className="searchBar">
      <form onSubmit={handleFormSubmit}>
        <input valur={term} onChange={handleChange} />
      </form>
    </div>
  );
}

export default SearchBar;
