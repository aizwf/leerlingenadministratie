import { useState } from "react";
import {
  getAantalOntbrekend,
  zijnDocumentenCompleet,
} from "../components/documentHelpers";

function LeerlingenOverzicht({ role, onLogout, onSelectLeerling, leerlingen }) {
  const [alleenProblemen, setAlleenProblemen] = useState(false);
    return (
      <div style={{ padding: 40 }}>
        <h1>AIZW Leerlingenadministratie</h1>
        <p>Ingelogd als: {role}</p>
  
        <div style={{ marginTop: 24 }}>
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
    <h2 style={{ margin: 0 }}>Leerlingen</h2>

    <button onClick={() => setAlleenProblemen(!alleenProblemen)}>
      {alleenProblemen ? "Toon alle leerlingen" : "Toon alleen problemen"}
    </button>
  </div>
  
  {[...leerlingen]
  .filter((leerling) => {
    if (!alleenProblemen) return true;
    return getAantalOntbrekend(leerling) > 0;
  })
  .sort((a, b) => {
    const aOntbrekend = getAantalOntbrekend(a);
    const bOntbrekend = getAantalOntbrekend(b);
    return bOntbrekend - aOntbrekend;
  })
  .map((leerling) => {
  const documentenLijst = Object.entries(leerling.documenten || {});
  const aantalOntbrekend = documentenLijst.filter(([, value]) => !value).length;
  const compleet = aantalOntbrekend === 0;

  return (
            <div
              key={leerling.id}
              onClick={() => onSelectLeerling(leerling)}
              style={{
                border: "1px solid #444",
                padding: 12,
                marginBottom: 12,
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              <div><strong>{leerling.naam}</strong></div>
              <div>{leerling.persoonsnummer}-{leerling.dienstverbandnr}</div>
              <div>{leerling.afdeling}</div>
              <div>{leerling.functie}</div>
              <div>
                Status:{" "}
                <div style={{ marginTop: 6 }}>
  <span
    style={{
      padding: "4px 8px",
      borderRadius: 6,
      backgroundColor: compleet ? "green" : "orange",
      color: "white",
      fontSize: 12,
    }}
  >
    {compleet
      ? "Documenten compleet"
      : `${aantalOntbrekend} ontbrekend`}
  </span>
</div>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    backgroundColor:
                      leerling.status === "Actief in opleiding"
                        ? "green"
                        : leerling.status === "In onboarding"
                        ? "orange"
                        : "gray",
                    color: "white",
                    fontSize: 12,
                  }}
                >
                  {leerling.status}
                </span>
              </div>
            </div>
            );
        })}
        </div>
  
        <button onClick={onLogout}>Uitloggen</button>
      </div>
    );
  }
  
  export default LeerlingenOverzicht;