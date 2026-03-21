import { useState } from "react";
import {
  getDocumentenLijst,
  getAantalOntbrekend,
  zijnDocumentenCompleet,
} from "../components/documentHelpers";

function LeerlingDetail({ leerling, role, onBack, onSave }) {
  const canSeeFunctie = true;
  const canEditStatus = role === "HR" || role === "SLB";
  const canSeePersoonsnummer = true;
  const canSeeBSN = role === "Subsidie";

  const documentenLijst = getDocumentenLijst(leerling);
  const aantalOntbrekend = getAantalOntbrekend(leerling);
  const documentenCompleet = zijnDocumentenCompleet(leerling);

  const [isEditing, setIsEditing] = useState(false);
  const [editedLeerling, setEditedLeerling] = useState(leerling);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedLeerling({
      ...editedLeerling,
      [name]: value,
    });
  };

  const handleSave = () => {
    onSave(editedLeerling);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedLeerling(leerling);
    setIsEditing(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>AIZW Leerlingenadministratie</h1>

      <button onClick={onBack}>← Terug</button>

      <h2 style={{ marginTop: 20 }}>{leerling.naam}</h2>

      <div style={{ marginTop: 16 }}>
        {canSeePersoonsnummer && (
          <div>
            <strong>Persoonsnummer:</strong> {leerling.persoonsnummer}
          </div>
        )}

        {canSeeBSN && (
          <div>
            <strong>BSN:</strong> {leerling.bsn}
          </div>
        )}

        <div>
          <strong>Dienstverband:</strong> {leerling.dienstverbandnr}
        </div>

        <div>
          <strong>Afdeling:</strong> {leerling.afdeling}
        </div>

        {canSeeFunctie && (
          <div>
            <strong>Functie:</strong> {leerling.functie}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <strong>Opleiding:</strong>{" "}
          {isEditing && canEditStatus ? (
            <input
              type="text"
              name="opleiding"
              value={editedLeerling.opleiding || ""}
              onChange={handleChange}
            />
          ) : (
            leerling.opleiding
          )}
        </div>

        <div>
          <strong>Leerweg:</strong>{" "}
          {isEditing && canEditStatus ? (
            <select
              name="leerweg"
              value={editedLeerling.leerweg || ""}
              onChange={handleChange}
            >
              <option value="BBL">BBL</option>
              <option value="BOL">BOL</option>
            </select>
          ) : (
            leerling.leerweg
          )}
        </div>

        <div>
          <strong>Niveau:</strong>{" "}
          {isEditing && canEditStatus ? (
            <input
              type="text"
              name="niveau"
              value={editedLeerling.niveau || ""}
              onChange={handleChange}
            />
          ) : (
            leerling.niveau
          )}
        </div>

        <div>
          <strong>Startdatum:</strong>{" "}
          {isEditing && canEditStatus ? (
            <input
              type="date"
              name="startdatum"
              value={editedLeerling.startdatum || ""}
              onChange={handleChange}
            />
          ) : (
            leerling.startdatum
          )}
        </div>

        <div>
          <strong>Verwachte diplomadatum:</strong>{" "}
          {isEditing && canEditStatus ? (
            <input
              type="date"
              name="verwachteDiplomadatum"
              value={editedLeerling.verwachteDiplomadatum || ""}
              onChange={handleChange}
            />
          ) : (
            leerling.verwachteDiplomadatum
          )}
        </div>

        <div>
          <strong>SLB:</strong>{" "}
          {isEditing && canEditStatus ? (
            <input
              type="text"
              name="slb"
              value={editedLeerling.slb || ""}
              onChange={handleChange}
            />
          ) : (
            leerling.slb
          )}
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Status:</strong>{" "}
          {isEditing && canEditStatus ? (
            <select
              name="status"
              value={editedLeerling.status}
              onChange={handleChange}
            >
              <option value="Actief in opleiding">Actief in opleiding</option>
              <option value="In onboarding">In onboarding</option>
              <option value="Afgerond">Afgerond</option>
            </select>
          ) : (
            leerling.status
          )}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <strong>Documenten:</strong>

        <div
          style={{
            marginTop: 10,
            marginBottom: 12,
            padding: 10,
            borderRadius: 8,
            backgroundColor: documentenCompleet ? "#1f4d2e" : "#5a3b00",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {documentenCompleet
            ? "Alle documenten compleet"
            : `${aantalOntbrekend} document(en) ontbreken`}
        </div>

        <div style={{ marginTop: 10 }}>
          {documentenLijst.map(([key, value]) => (
            <div key={key}>
              {key}:{" "}
              <span
                style={{
                  color: value ? "lightgreen" : "orange",
                  fontWeight: "bold",
                }}
              >
                {value ? "Compleet" : "Ontbreekt"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        {canEditStatus &&
          (isEditing ? (
            <>
              <button onClick={handleSave}>Opslaan</button>
              <button onClick={handleCancel} style={{ marginLeft: 8 }}>
                Annuleren
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)}>Bewerken</button>
          ))}
      </div>
    </div>
  );
}

export default LeerlingDetail;