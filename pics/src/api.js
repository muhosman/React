import axios from "axios";

const searchImages = async (object) => {
  const response = await axios.get("https://api.unsplash.com/search/photos", {
    headers: {
      Authorization: "Client-ID bapFUi_Ib-Y9Dz7HzVj6gcnZlPkeKLN65RasaZp5AAI",
    },
    params: {
      query: object,
    },
  });
  return response.data.results;
};

export default searchImages;
