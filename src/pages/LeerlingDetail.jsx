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
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={onBack}>← Terug</button>
        <h2 className="page-title" style={{ marginBottom: 0 }}>
          {leerling.naam}
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        <div className="card">
          <div style={{ fontWeight: "bold", marginBottom: 12 }}>Basisgegevens</div>

          {canSeePersoonsnummer && (
            <div style={{ marginBottom: 8 }}>
              <strong>Persoonsnummer:</strong> {leerling.persoonsnummer}
            </div>
          )}

          {canSeeBSN && (
            <div style={{ marginBottom: 8 }}>
              <strong>BSN:</strong> {leerling.bsn}
            </div>
          )}

          <div style={{ marginBottom: 8 }}>
            <strong>Dienstverband:</strong> {leerling.dienstverbandnr}
          </div>

          <div style={{ marginBottom: 8 }}>
            <strong>Afdeling:</strong> {leerling.afdeling}
          </div>

          {canSeeFunctie && (
            <div style={{ marginBottom: 8 }}>
              <strong>Functie:</strong> {leerling.functie}
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ fontWeight: "bold", marginBottom: 12 }}>Procesgegevens</div>

          <div style={{ marginBottom: 10 }}>
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

          <div style={{ marginBottom: 10 }}>
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

          <div style={{ marginBottom: 10 }}>
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

          <div style={{ marginBottom: 10 }}>
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

          <div style={{ marginBottom: 10 }}>
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

          <div style={{ marginBottom: 10 }}>
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

          <div style={{ marginBottom: 10 }}>
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
              <span
                className={`badge ${
                  leerling.status === "Actief in opleiding"
                    ? "badge-green"
                    : leerling.status === "In onboarding"
                    ? "badge-orange"
                    : "badge-gray"
                }`}
              >
                {leerling.status}
              </span>
            )}
          </div>

          <div style={{ marginTop: 16 }}>
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
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ fontWeight: "bold", marginBottom: 12 }}>Documenten</div>

        <div
          className={`badge ${
            documentenCompleet ? "badge-green" : "badge-orange"
          }`}
          style={{ display: "inline-block", marginBottom: 12 }}
        >
          {documentenCompleet
            ? "Alle documenten compleet"
            : `${aantalOntbrekend} document(en) ontbreken`}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 8,
          }}
        >
          {documentenLijst.map(([key, value]) => (
            <div key={key} className="card" style={{ padding: 12 }}>
              <div style={{ fontWeight: "bold", marginBottom: 6 }}>{key}</div>
              <span className={`badge ${value ? "badge-green" : "badge-orange"}`}>
                {value ? "Compleet" : "Ontbreekt"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LeerlingDetail;