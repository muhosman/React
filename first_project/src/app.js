import ProfileCard from "./profilecard";
import AlexaImage from "./images/alexa.png";
import CortanaImage from "./images/cortana.png";
import SiriImage from "./images/siri.png";
import "bulma/css/bulma.css";

function app() {
  return (
    <div>
      <section className="hero is-primary">
        <div className="hero-body">
          <p className="title has-text-centered">Personal Digital Assistants</p>
        </div>
      </section>
      <div className="container">
        <section className="section">
          <div className="columns">
            <div className="column is-4">
              <ProfileCard text="asdf" handle="@alexa99" image={AlexaImage} />
            </div>
            <div className="column is-4">
              <ProfileCard
                text="asdfwq"
                handle="@cortana50"
                image={CortanaImage}
              />
            </div>
            <div className="column is-4">
              <ProfileCard text="fgfbdsf" handle="@siri01" image={SiriImage} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default app;
