import { useState } from "react";
import SearchBar from "./Components/SearchBar.js";
import ImageList from "./Components/ImageList.js";
import searchImages from "./api.js";

function App() {
  const [images, setImages] = useState([]);

  const handleSubmit = async (term) => {
    const result = await searchImages(term);
    console.log(result);
    setImages(result);
  };
  return (
    <div>
      <SearchBar onSubmit={handleSubmit} />
      <ImageList images={images} />
    </div>
  );
}

export default App;
