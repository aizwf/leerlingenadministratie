import { useRef } from "react";
import { getAantalOntbrekend } from "../components/documentHelpers";
import {
  getSignaleringen,
  heeftSignaleringen,
} from "../components/signaleringHelpers";

function Dashboard({
  leerlingen,
  onImportDocumenten,
  onImportHr,
  role,
  importFeedback,
  hrImportFeedback,
}) {
  const documentenFileInputRef = useRef(null);
  const hrFileInputRef = useRef(null);
  const canImport = role === "HR";

  const totaal = leerlingen.length;

  const aantalMetProblemen = leerlingen.filter((leerling) =>
    heeftSignaleringen(leerling)
  ).length;

  const aantalActief = leerlingen.filter(
    (leerling) => leerling.status === "Actief in opleiding"
  ).length;

  const aantalOnboarding = leerlingen.filter(
    (leerling) => leerling.status === "In onboarding"
  ).length;

  const aantalDiplomaBinnen90Dagen = leerlingen.filter((leerling) =>
    getSignaleringen(leerling).includes("Diplomadatum binnen 90 dagen")
  ).length;

  const aantalGeenSLB = leerlingen.filter((leerling) =>
    getSignaleringen(leerling).includes("Geen SLB gekoppeld")
  ).length;

  return (
    <div>
      <h1>AIZW Leerlingenadministratie</h1>
      <h2 style={{ marginTop: 20 }}>Dashboard</h2>

      {canImport && (
        <div style={{ marginTop: 16, marginBottom: 20 }}>
          <button onClick={() => hrFileInputRef.current?.click()}>
            HR-data importeren (CSV)
          </button>

          <input
            ref={hrFileInputRef}
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={onImportHr}
          />

          <button
            onClick={() => documentenFileInputRef.current?.click()}
            style={{ marginLeft: 8 }}
          >
            Documentstatus importeren (CSV)
          </button>

          <input
            ref={documentenFileInputRef}
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={onImportDocumenten}
          />
        </div>
      )}

      {hrImportFeedback && (
        <div
          style={{
            marginBottom: 20,
            padding: 12,
            borderRadius: 8,
            backgroundColor: hrImportFeedback.success ? "#1f4d2e" : "#5a1f1f",
            color: "white",
          }}
        >
          <div style={{ fontWeight: "bold" }}>{hrImportFeedback.message}</div>

          {hrImportFeedback.errors?.length > 0 && (
            <ul style={{ marginTop: 8, paddingLeft: 20 }}>
              {hrImportFeedback.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {importFeedback && (
        <div
          style={{
            marginBottom: 20,
            padding: 12,
            borderRadius: 8,
            backgroundColor: importFeedback.success ? "#1f4d2e" : "#5a1f1f",
            color: "white",
          }}
        >
          <div style={{ fontWeight: "bold" }}>{importFeedback.message}</div>

          {importFeedback.errors?.length > 0 && (
            <ul style={{ marginTop: 8, paddingLeft: 20 }}>
              {importFeedback.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 220px)",
          gap: 16,
          marginTop: 24,
        }}
      >
        <div style={{ border: "1px solid #444", borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 14 }}>Totaal leerlingen</div>
          <div style={{ fontSize: 28, fontWeight: "bold", marginTop: 8 }}>
            {totaal}
          </div>
        </div>

        <div style={{ border: "1px solid #444", borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 14 }}>Leerlingen met problemen</div>
          <div style={{ fontSize: 28, fontWeight: "bold", marginTop: 8 }}>
            {aantalMetProblemen}
          </div>
        </div>

        <div style={{ border: "1px solid #444", borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 14 }}>Actief in opleiding</div>
          <div style={{ fontSize: 28, fontWeight: "bold", marginTop: 8 }}>
            {aantalActief}
          </div>
        </div>

        <div style={{ border: "1px solid #444", borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 14 }}>In onboarding</div>
          <div style={{ fontSize: 28, fontWeight: "bold", marginTop: 8 }}>
            {aantalOnboarding}
          </div>
        </div>
                <div style={{ border: "1px solid #444", borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 14 }}>Diplomadatum binnen 90 dagen</div>
          <div style={{ fontSize: 28, fontWeight: "bold", marginTop: 8 }}>
            {aantalDiplomaBinnen90Dagen}
          </div>
        </div>

        <div style={{ border: "1px solid #444", borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 14 }}>Geen SLB gekoppeld</div>
          <div style={{ fontSize: 28, fontWeight: "bold", marginTop: 8 }}>
            {aantalGeenSLB}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;