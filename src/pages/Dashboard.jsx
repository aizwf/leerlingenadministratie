import { useRef } from "react";
import {
  heeftSignaleringen,
  getSignaleringen,
} from "../components/signaleringHelpers";

function Dashboard({
  leerlingen,
  onImportDocumenten,
  onImportHr,
  onImportUren,
  role,
  importFeedback,
  hrImportFeedback,
  urenImportFeedback,
}) {
  const documentenFileInputRef = useRef(null);
  const hrFileInputRef = useRef(null);
  const urenFileInputRef = useRef(null);
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
      <h2 className="page-title">Dashboard</h2>

      {canImport && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: "bold", marginBottom: 12 }}>Imports</div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => hrFileInputRef.current?.click()}>
              HR-data importeren
            </button>

            <input
              ref={hrFileInputRef}
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={onImportHr}
            />

            <button onClick={() => documentenFileInputRef.current?.click()}>
              Documentstatus importeren
            </button>

            <input
              ref={documentenFileInputRef}
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={onImportDocumenten}
            />

            <button onClick={() => urenFileInputRef.current?.click()}>
              Uren importeren
            </button>

            <input
              ref={urenFileInputRef}
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={onImportUren}
            />
          </div>
        </div>
      )}

      {hrImportFeedback && (
        <FeedbackCard feedback={hrImportFeedback} />
      )}

      {importFeedback && (
        <FeedbackCard feedback={importFeedback} />
      )}

      {urenImportFeedback && (
        <FeedbackCard feedback={urenImportFeedback} />
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginTop: 24,
        }}
      >
        <DashboardCard label="Totaal leerlingen" value={totaal} />
        <DashboardCard label="Leerlingen met signaleringen" value={aantalMetProblemen} />
        <DashboardCard label="Actief in opleiding" value={aantalActief} />
        <DashboardCard label="In onboarding" value={aantalOnboarding} />
        <DashboardCard
          label="Diplomadatum binnen 90 dagen"
          value={aantalDiplomaBinnen90Dagen}
        />
        <DashboardCard label="Geen SLB gekoppeld" value={aantalGeenSLB} />
      </div>
    </div>
  );
}

function DashboardCard({ label, value }) {
  return (
    <div className="card">
      <div style={{ fontSize: 14, opacity: 0.9 }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: "bold", marginTop: 10 }}>
        {value}
      </div>
    </div>
  );
}

function FeedbackCard({ feedback }) {
  return (
    <div
      className="card"
      style={{
        marginBottom: 16,
        backgroundColor: feedback.success ? "#1f4d2e" : "#5a1f1f",
        color: "white",
      }}
    >
      <div style={{ fontWeight: "bold" }}>{feedback.message}</div>

      {feedback.errors?.length > 0 && (
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          {feedback.errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;