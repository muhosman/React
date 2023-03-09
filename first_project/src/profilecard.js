function profilecard({ text, handle, image }) {
  return (
    <div className="card">
      <div className="card-image">
        <figure className="image is-1by1">
          <img src={image} alt="profileimg" />
        </figure>
      </div>
      <div className="card-content">
        <div className="media-content">
          <p className="title is-4">Title is {text}</p>
          <p className="subtitle is-6">This is handle {handle}</p>
        </div>
      </div>
    </div>
  );
}

export default profilecard;
