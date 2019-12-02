import React, { useState } from "react";
import Scrollspy from "react-scrollspy";
import { useDropzone } from "react-dropzone";
import swal from "sweetalert";

import config from "./config.json";
import logo from "./assets/logopolital.png";
import intro from "./assets/bulles.png";

function PriseCard({ title, price, descrition: description, className, buttonText, onClickHandler }) {
  return (
    <div className={`tarif-card ${className ? className : 'plain-tarif'}`}>
      <h1 className="tarif-title">{title}</h1>
      <hr className="tarif-separator" />
      <div className="tarif-price">
        <p>{`${price}\u20AC`}</p>
      </div>
      <div className="tarif-description">
        {(
          description.map((des, idx) => (<div key={`${idx}`}>{des}</div>))
        )}
      </div>
      <div className="tarif-footer">
        <button onClick={onClickHandler} className="buy-button">{buttonText}</button>
      </div>
    </div>
  );
}

const PolitalInput = ({
  id = "",
  name,
  value,
  type = "text",
  placeholder,
  onChangeHandler
}) => {
  return (
    <div>
      <label htmlFor={id}>{placeholder}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChangeHandler}
      />
    </div>
  );
};

const PolitalTextArea = ({
  id = "",
  name,
  value,
  placeholder,
  onChangeHandler
}) => {
  return (
    <div>
      <label htmlFor={id}>{placeholder}</label>
      <textarea name={name} id={id} value={value} onChange={onChangeHandler} />
    </div>
  );
};

function App() {
  const [extractions, setExtractions] = useState();

  const handleUpload = files => {
    let data = new FormData();
    data.append("file", files[0]);

    fetch(config.apiEndpoint, {
      method: "post",
      body: data
    })
      .then(response => response.json())
      .then(res => {
        console.log(res);
        setExtractions(res);
      })
      .catch(err => console.error(err));
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: handleUpload
  });

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.name}
    </li>
  ));

  return (
    <div className="App">
      <header className="app-header">
        <img className="app-logo" src={logo} alt="Logo" />
        <nav>
          <Scrollspy
            className="app-nav"
            items={[
              "section-about",
              "section-tarifs",
              "section-try",
              "section-contact"
            ]}
            currentClassName="current-section"
          >
            <li>
              <a href="#section-about">C'est quoi?</a>
            </li>
            {/* <a>Pour qui?</a> */}
            <li>
              <a href="#section-tarifs">Tarifs</a>
            </li>
            <li>
              <a href="#section-try">Essayer</a>
            </li>
            <li>
              <a href="#section-contact">Contact</a>
            </li>
          </Scrollspy>
        </nav>
      </header>
      <div className="app-content">
        <section id="section-about" className="section-about">
          <h1 className="sec-header light">Polital, qu'est-ce que c'est?</h1>
          <img src={intro} alt="Je suis d'accord!" />
          <div className="about-text">
            <ul className="section-list">
              <li className="section-list-item">
                Extraire automatiquement{" "}
                <span className="light">
                  {" "}
                  les principales idées des discours politiques{" "}
                </span>{" "}
                et en faciliter le décryptage.
              </li>
              <li className="section-list-item">
                <span className="light">Faciliter le quotidien</span> des professionnels en leur faisant gagner du temps dans la rédaction de leurs articles
              </li>
              <li className="section-list-item">
                Promouvoir l’objectivité de l’analyse du discours par analyse automatique,
                <span className="light">
                  {" "}
                  limiter la diffusion de fake news
                </span>
                .
              </li>
            </ul>
          </div>
        </section>
        <section id="section-tarifs" className="section-tarifs">
          <h1 className="sec-header light">Nos tarifs</h1>
          <div className="tarif-cards">
            <PriseCard title="Gratuit" price="0" descrition={["Première requête gratuit"]} buttonText={"Essayer"}/>
            <PriseCard className="main-tarif" title="Illimité" price="450" descrition={["Requêtes illimitées", "Premier mois à 250\u20AC"]} buttonText={"Payer"} />
            <PriseCard title="Plain" price="200" descrition={["50 requêtes"]} buttonText={"Payer"} />
          </div>
        </section>
        {/* <section>
        <h1>Pour qui?</h1>
        <p>Si vous etes:</p>
        <ul>
          <li>Un média</li>
          <li>Chargé de communication</li>
        </ul>
      </section> */}
        <section id="section-try" className="section-try">
          <h1 className="sec-header light">Essayer</h1>
          <div className="try-content">
            <div className="try-content-1">
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop une fiche ici, ou toucher le button pour selectioner</p>
              </div>
              <div>
                <h4>Files</h4>
                <ul>{files}</ul>
              </div>
            </div>
            {extractions && (
              <aside className="try-content-2">
                <div>
                  <h2 className="try-result-header">Les mots clés :</h2>
                  <div>
                    <ul className="section-list">
                      {extractions.keywords.map((keyword, idx) => (
                        <li className="section-list-item" key={`keyword-${idx}`}>{keyword}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h2 className="try-result-header">Resume :</h2>
                  <div className="try-summary">{extractions.summary}</div>
                </div>
              </aside>
            )}
          </div>
        </section>
        <section id="section-contact" className="section-contact">
          <h1 className="sec-header light">Un devis? Une question?</h1>
          <div className="contact-form-description">
            Vous souhatez un devis ou simplement nous contacter? <br />
            Nous sommes à l'écoute de vos remarques, questions et autres.
          </div>
          <form className="contact-form">
            <PolitalInput id="1" placeholder="Nom" name="name" />
            <PolitalInput
              id="2"
              placeholder="Courriel"
              name="email"
              type="email"
            />
            <PolitalInput id="3" placeholder="Objet" name="Subject" />
            <PolitalTextArea id="4" placeholder="Message" name="message" />
            <div className="contact-form-footer">
              <button className="contact-button" onClick={() => swal("Merci!")}>Envoyer</button>
            </div>
          </form>
        </section>
      </div>
      <footer></footer>
    </div>
  );
}

export default App;
