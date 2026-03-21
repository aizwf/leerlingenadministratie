import { useState } from "react";
import {
  getAantalOntbrekend,
  zijnDocumentenCompleet,
} from "../components/documentHelpers";
import {
  getSignaleringen,
  heeftSignaleringen,
} from "../components/signaleringHelpers";

function LeerlingenOverzicht({ role, onLogout, onSelectLeerling, leerlingen }) {
  const [alleenProblemen, setAlleenProblemen] = useState(false);

  return (
    <div style={{ padding: 40 }}>
      <h1>AIZW Leerlingenadministratie</h1>
      <p>Ingelogd als: {role}</p>

      <div style={{ marginTop: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <h2 style={{ margin: 0 }}>Leerlingen</h2>

          <button onClick={() => setAlleenProblemen(!alleenProblemen)}>
            {alleenProblemen ? "Toon alle leerlingen" : "Toon alleen problemen"}
          </button>
        </div>

        {[...leerlingen]
          .filter((leerling) => {
            if (!alleenProblemen) return true;
            return heeftSignaleringen(leerling);
          })
          .sort((a, b) => {
            const aSignalen = getSignaleringen(a).length;
            const bSignalen = getSignaleringen(b).length;
            return bSignalen - aSignalen;
          })
          .map((leerling) => {
            const aantalOntbrekend = getAantalOntbrekend(leerling);
            const compleet = zijnDocumentenCompleet(leerling);
            const signaleringen = getSignaleringen(leerling);

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
                <div>
                  <strong>{leerling.naam}</strong>
                </div>
                <div>
                  {leerling.persoonsnummer}-{leerling.dienstverbandnr}
                </div>
                <div>{leerling.afdeling}</div>
                <div>{leerling.functie}</div>

                <div style={{ marginTop: 8 }}>
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
                      marginRight: 8,
                    }}
                  >
                    {leerling.status}
                  </span>

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

                {signaleringen.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    {signaleringen.map((signaal, index) => (
                      <div
                        key={index}
                        style={{
                          fontSize: 12,
                          color: "orange",
                          marginTop: 4,
                        }}
                      >
                        ⚠ {signaal}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <button onClick={onLogout}>Uitloggen</button>
    </div>
  );
}

export default LeerlingenOverzicht;