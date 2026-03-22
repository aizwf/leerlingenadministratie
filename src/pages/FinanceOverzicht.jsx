import { useMemo, useState } from "react";

function FinanceOverzicht({ leerlingen, setLeerlingen, rol }) {
  // Houdt tijdelijke wijzigingen bij voordat ze definitief worden opgeslagen
  const [draftFinance, setDraftFinance] = useState({});

  const magBewerken = rol === "Finance";
  const magPaginaZien = rol === "Finance" || rol === "HR";

  const gesorteerdeLeerlingen = useMemo(() => {
    return [...leerlingen].sort((a, b) => a.naam.localeCompare(b.naam));
  }, [leerlingen]);

  const handleFinanceFieldChange = (leerlingId, field, value) => {
    if (!magBewerken) return;

    setLeerlingen((prevLeerlingen) =>
      prevLeerlingen.map((leerling) => {
        if (leerling.id !== leerlingId) return leerling;

        return {
          ...leerling,
          finance: {
            ...(leerling.finance || {}),
            [field]: value,
          },
        };
      })
    );
  };

  const isGeldigeKostenplaats = (waarde = "") => /^\d{3}-\d{4}$/.test(waarde);
  const isGeldigeKostensoort = (waarde = "") => /^\d{5}$/.test(waarde);
  const isGeldigBoekstuknummer = (waarde = "") =>
    /^FIN-\d{4}-\d{4}$/.test(waarde);

  if (!magPaginaZien) {
    return (
      <div className="container">
        <h2 className="page-title">Finance</h2>
        <div className="card" style={{ marginTop: 20 }}>
          Je hebt geen toegang tot deze pagina.
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="page-title">Finance</h2>

      <div className="card" style={{ marginTop: 20, marginBottom: 16 }}>
        <strong>Aantal leerlingen:</strong> {gesorteerdeLeerlingen.length}
        <br />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Persoonsnummer</th>
              <th>DVB nr</th>
              <th>Startdatum</th>
              <th>Einddatum</th>
              <th>Afdeling</th>
              <th>Kostenplaats</th>
              <th>Kostensoort</th>
              <th>Boekstuknummer</th>
              <th>Acties</th>
            </tr>
          </thead>

          <tbody>
            {gesorteerdeLeerlingen.map((leerling) => {
              const finance = leerling.finance || {};
              const draft = draftFinance[leerling.id] || {};

              return (
                <tr key={leerling.id}>
                  <td>{leerling.persoonsnummer}</td>
                  <td>{leerling.dienstverbandnr}</td>
                  <td>{leerling.startdatum || "-"}</td>
                  <td>{leerling.einddatum || "-"}</td>
                  <td>{leerling.afdeling || "-"}</td>

                  {/* Kostenplaats */}
                  <td>
                    <input
                      value={draft.kostenplaats ?? finance.kostenplaats ?? ""}
                      placeholder="110-2300"
                      disabled={!magBewerken}
                      onChange={(e) =>
                        setDraftFinance((prev) => ({
                          ...prev,
                          [leerling.id]: {
                            ...prev[leerling.id],
                            kostenplaats: e.target.value,
                          },
                        }))
                      }
                    />
                  </td>

                  {/* Kostensoort */}
                  <td>
                    <input
                      value={draft.kostensoort ?? finance.kostensoort ?? ""}
                      placeholder="13245"
                      disabled={!magBewerken}
                      onChange={(e) =>
                        setDraftFinance((prev) => ({
                          ...prev,
                          [leerling.id]: {
                            ...prev[leerling.id],
                            kostensoort: e.target.value,
                          },
                        }))
                      }
                    />
                  </td>

                  {/* Boekstuknummer */}
                  <td>
                    <input
                      value={
                        draft.boekstuknummer ??
                        finance.boekstuknummer ??
                        ""
                      }
                      placeholder="FIN-2026-0001"
                      disabled={!magBewerken}
                      onChange={(e) =>
                        setDraftFinance((prev) => ({
                          ...prev,
                          [leerling.id]: {
                            ...prev[leerling.id],
                            boekstuknummer: e.target.value,
                          },
                        }))
                      }
                    />
                  </td>

                  {/* Opslaan knop */}
                  <td>
                    <button
                      disabled={!magBewerken}
                      onClick={() => {
                        const d = draftFinance[leerling.id];
                        if (!d) return;

                        if (d.kostenplaats)
                          handleFinanceFieldChange(
                            leerling.id,
                            "kostenplaats",
                            d.kostenplaats
                          );
                        if (d.kostensoort)
                          handleFinanceFieldChange(
                            leerling.id,
                            "kostensoort",
                            d.kostensoort
                          );
                        if (d.boekstuknummer)
                          handleFinanceFieldChange(
                            leerling.id,
                            "boekstuknummer",
                            d.boekstuknummer
                          );

                        // reset draft
                        setDraftFinance((prev) => {
                          const copy = { ...prev };
                          delete copy[leerling.id];
                          return copy;
                        });
                      }}
                    >
                      Opslaan
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FinanceOverzicht;