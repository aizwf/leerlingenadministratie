import { useState } from "react";
import LoginScreen from "./pages/LoginScreen";
import LeerlingenOverzicht from "./pages/LeerlingenOverzicht";
import LeerlingDetail from "./pages/LeerlingDetail";
import Dashboard from "./pages/Dashboard";
import SubsidieOverzicht from "./pages/SubsidieOverzicht";
import AppShell from "./components/AppShell";
import { leerlingen as initialLeerlingen } from "./data/mockData";
import { parseDocumentenCSV } from "./data/csvImportDocs";
import { parseHrCSV } from "./data/csvImportHr";
import { parseUrenCSV } from "./data/csvImportUren";

function App() {
  const [role, setRole] = useState(null);
  const [view, setView] = useState("dashboard");
  const [selectedLeerling, setSelectedLeerling] = useState(null);
  const [leerlingen, setLeerlingen] = useState(initialLeerlingen);
  const [urenData, setUrenData] = useState([]);
  const [importFeedback, setImportFeedback] = useState(null);
  const [hrImportFeedback, setHrImportFeedback] = useState(null);
  const [urenImportFeedback, setUrenImportFeedback] = useState(null);

  const handleSelectLeerling = (leerling) => {
    setSelectedLeerling(leerling);
  };

  const handleSaveLeerling = (updatedLeerling) => {
    const updatedLeerlingen = leerlingen.map((leerling) =>
      leerling.id === updatedLeerling.id ? updatedLeerling : leerling
    );

    setLeerlingen(updatedLeerlingen);
    setSelectedLeerling(updatedLeerling);
  };

  const handleImportDocumenten = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const result = parseDocumentenCSV(text);

    if (!result.success) {
      setImportFeedback({
        success: false,
        message: "Import mislukt",
        errors: result.errors,
      });
      event.target.value = "";
      return;
    }

    let bijgewerkt = 0;
    let nietGevonden = 0;

    const updatedLeerlingen = leerlingen.map((leerling) => {
      const match = result.rows.find(
        (row) =>
          row.persoonsnummer === leerling.persoonsnummer &&
          String(row.dienstverbandnr) === String(leerling.dienstverbandnr)
      );

      if (!match) return leerling;

      bijgewerkt += 1;

      return {
        ...leerling,
        documenten: {
          overeenkomst: match.overeenkomst === "1",
          idbewijs: match.idbewijs === "1",
          diploma: match.diploma === "1",
        },
      };
    });

    result.rows.forEach((row) => {
      const exists = leerlingen.some(
        (leerling) =>
          leerling.persoonsnummer === row.persoonsnummer &&
          String(leerling.dienstverbandnr) === String(row.dienstverbandnr)
      );

      if (!exists) {
        nietGevonden += 1;
      }
    });

    setLeerlingen(updatedLeerlingen);
    setImportFeedback({
      success: true,
      message: `Import gelukt: ${bijgewerkt} leerling(en) bijgewerkt`,
      errors:
        nietGevonden > 0
          ? [`${nietGevonden} regel(s) konden niet gematcht worden.`]
          : [],
    });

    event.target.value = "";
  };

  const handleImportHr = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const result = parseHrCSV(text);

    if (!result.success) {
      setHrImportFeedback({
        success: false,
        message: "HR-import mislukt",
        errors: result.errors,
      });
      event.target.value = "";
      return;
    }

    let bijgewerkt = 0;
    let nietGevonden = 0;

    const updatedLeerlingen = leerlingen.map((leerling) => {
      const match = result.rows.find(
        (row) =>
          row.persoonsnummer === leerling.persoonsnummer &&
          String(row.dienstverbandnr) === String(leerling.dienstverbandnr)
      );

      if (!match) return leerling;

      bijgewerkt += 1;

      return {
        ...leerling,
        naam: match.naam,
        afdeling: match.afdeling,
        functie: match.functie,
        bsn: match.bsn,
      };
    });

    result.rows.forEach((row) => {
      const exists = leerlingen.some(
        (leerling) =>
          leerling.persoonsnummer === row.persoonsnummer &&
          String(leerling.dienstverbandnr) === String(row.dienstverbandnr)
      );

      if (!exists) {
        nietGevonden += 1;
      }
    });

    setLeerlingen(updatedLeerlingen);
    setHrImportFeedback({
      success: true,
      message: `HR-import gelukt: ${bijgewerkt} leerling(en) bijgewerkt`,
      errors:
        nietGevonden > 0
          ? [`${nietGevonden} regel(s) konden niet gematcht worden.`]
          : [],
    });

    event.target.value = "";
  };

  const handleImportUren = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const result = parseUrenCSV(text);

    if (!result.success) {
      setUrenImportFeedback({
        success: false,
        message: "Urenimport mislukt",
        errors: result.errors,
      });
      event.target.value = "";
      return;
    }

    setUrenData(result.rows);

    setUrenImportFeedback({
      success: true,
      message: `Urenimport gelukt: ${result.rows.length} regel(s) geladen`,
      errors: [],
    });

    event.target.value = "";
  };

  if (!role) {
    return (
      <LoginScreen
        onLogin={(gekozenRol) => {
          setRole(gekozenRol);
          setView("dashboard");
        }}
      />
    );
  }

  if (role === "Subsidie") {
    return (
      <AppShell
        title="AIZW Leerlingenadministratie"
        role={role}
        actions={
          <>
            <button
              onClick={() => {
                setRole(null);
                setSelectedLeerling(null);
              }}
            >
              Uitloggen
            </button>
          </>
        }
      >
        <SubsidieOverzicht
          leerlingen={leerlingen}
          urenData={urenData}
          onLogout={() => {
            setRole(null);
            setSelectedLeerling(null);
          }}
        />
      </AppShell>
    );
  }

  if (selectedLeerling) {
    return (
      <LeerlingDetail
        leerling={selectedLeerling}
        role={role}
        onBack={() => setSelectedLeerling(null)}
        onSave={handleSaveLeerling}
      />
    );
  }

  return (
    <AppShell
      title="AIZW Leerlingenadministratie"
      role={role}
      actions={
        <>
          {role !== "Finance" && role !== "Subsidie" && (
            <button onClick={() => setView("dashboard")}>Dashboard</button>
          )}

          <button onClick={() => setView("overzicht")}>Overzicht</button>

          <button
            onClick={() => {
              setRole(null);
              setSelectedLeerling(null);
            }}
          >
            Uitloggen
          </button>
        </>
      }
    >
      {view === "dashboard" && role !== "Finance" && role !== "Subsidie" ? (
        <Dashboard
          leerlingen={leerlingen}
          role={role}
          onImportDocumenten={handleImportDocumenten}
          onImportHr={handleImportHr}
          onImportUren={handleImportUren}
          importFeedback={importFeedback}
          hrImportFeedback={hrImportFeedback}
          urenImportFeedback={urenImportFeedback}
        />
      ) : (
        <LeerlingenOverzicht
          role={role}
          onLogout={() => setRole(null)}
          onSelectLeerling={handleSelectLeerling}
          leerlingen={leerlingen}
        />
      )}
    </AppShell>
  );
}

export default App;