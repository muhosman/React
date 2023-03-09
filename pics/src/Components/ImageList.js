import ImageShow from "./ImageShow";
import "./ImageList.css";
function ImageList({ images }) {
  const renderedImage = images.map((image) => {
    console.log(image);

    return <ImageShow key={image.key} image={image} />;
  });

  return <div className="images">{renderedImage}</div>;
}

export default ImageList;
