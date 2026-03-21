import { useMemo, useState } from "react";

function SubsidieOverzicht({ leerlingen, urenData, onLogout }) {
  const vandaag = new Date().toISOString().split("T")[0];
  const [vanDatum, setVanDatum] = useState("2025-01-01");
  const [totEnMetDatum, setTotEnMetDatum] = useState(vandaag);

  const gefilterdeLeerlingen = useMemo(() => {
    return leerlingen
      .filter((leerling) => {
        const startdatum = leerling.startdatum || "";
        const einddatum = leerling.einddatum || vandaag;

        const startBinnenPeriode =
          startdatum >= vanDatum && startdatum <= totEnMetDatum;

        const eindBinnenPeriode =
          einddatum >= vanDatum && einddatum <= totEnMetDatum;

        return startBinnenPeriode || eindBinnenPeriode;
      })
      .map((leerling) => {
        const relevanteUren = urenData.filter((regel) => {
          return (
            regel.persoonsnummer === leerling.persoonsnummer &&
            String(regel.dienstverbandnr) === String(leerling.dienstverbandnr) &&
            regel.datum >= vanDatum &&
            regel.datum <= totEnMetDatum
          );
        });

        const gewerkteUren = relevanteUren.reduce(
          (som, regel) => som + Number(regel.gewerkteUren || 0),
          0
        );

        const ziekteverzuimuren = relevanteUren.reduce(
          (som, regel) => som + Number(regel.ziekteverzuimuren || 0),
          0
        );

        const verlofuren = relevanteUren.reduce(
          (som, regel) => som + Number(regel.verlofuren || 0),
          0
        );

        return {
          ...leerling,
          gewerkteUren,
          ziekteverzuimuren,
          verlofuren,
        };
      });
  }, [leerlingen, urenData, vanDatum, totEnMetDatum, vandaag]);

  const handleExportCsv = () => {
    const headers = [
      "bsn",
      "voornaam",
      "achternaam",
      "opleiding",
      "leerweg",
      "niveau",
      "startdatum",
      "einddatum",
      "crebonummer",
      "gewerkte_uren",
      "ziekteverzuimuren",
      "verlofuren",
    ];

        const rows = gefilterdeLeerlingen.map((leerling) => [
      leerling.bsn ?? "",
      leerling.voornaam ?? "",
      leerling.achternaam ?? "",
      leerling.opleiding ?? "",
      leerling.leerweg ?? "",
      leerling.niveau ?? "",
      leerling.startdatum ?? "",
      leerling.einddatum || vandaag,
      leerling.crebonummer ?? "",
      leerling.gewerkteUren ?? 0,
      leerling.ziekteverzuimuren ?? 0,
      leerling.verlofuren ?? 0,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `subsidieoverzicht_${vanDatum}_tm_${totEnMetDatum}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>AIZW Leerlingenadministratie</h1>
      <h2 style={{ marginTop: 20 }}>Subsidieoverzicht</h2>

      <div style={{ marginTop: 20, marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "end",
            flexWrap: "wrap",
          }}
        >
          <div>
            <label><strong>Van datum</strong></label>
            <br />
            <input
              type="date"
              value={vanDatum}
              onChange={(e) => setVanDatum(e.target.value)}
            />
          </div>

          <div>
            <label><strong>T/m datum</strong></label>
            <br />
            <input
              type="date"
              value={totEnMetDatum}
              onChange={(e) => setTotEnMetDatum(e.target.value)}
            />
          </div>

          <button onClick={handleExportCsv}>Exporteer CSV</button>
          <button onClick={onLogout}>Uitloggen</button>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Aantal leerlingen in periode:</strong> {gefilterdeLeerlingen.length}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #444",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>BSN</th>
              <th style={thStyle}>Voornaam</th>
              <th style={thStyle}>Achternaam</th>
              <th style={thStyle}>Opleiding</th>
              <th style={thStyle}>Leerweg</th>
              <th style={thStyle}>Niveau</th>
              <th style={thStyle}>Startdatum</th>
              <th style={thStyle}>Einddatum</th>
              <th style={thStyle}>Crebonummer</th>
              <th style={thStyle}>Gewerkte uren</th>
              <th style={thStyle}>Ziekteverzuimuren</th>
              <th style={thStyle}>Verlofuren</th>
            </tr>
          </thead>
          <tbody>
            {gefilterdeLeerlingen.map((leerling) => (
              <tr key={leerling.id}>
                <td style={tdStyle}>{leerling.bsn}</td>
                <td style={tdStyle}>{leerling.voornaam}</td>
                <td style={tdStyle}>{leerling.achternaam}</td>
                <td style={tdStyle}>{leerling.opleiding}</td>
                <td style={tdStyle}>{leerling.leerweg}</td>
                <td style={tdStyle}>{leerling.niveau}</td>
                <td style={tdStyle}>{leerling.startdatum}</td>
                <td style={tdStyle}>{leerling.einddatum || vandaag}</td>
                <td style={tdStyle}>{leerling.crebonummer}</td>
<td style={tdStyle}>{leerling.gewerkteUren}</td>
<td style={tdStyle}>{leerling.ziekteverzuimuren}</td>
<td style={tdStyle}>{leerling.verlofuren}</td>
              </tr>
            ))}

            {gefilterdeLeerlingen.length === 0 && (
              <tr>
                <td style={tdStyle} colSpan={12}>
                  Geen leerlingen gevonden binnen deze periode.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  border: "1px solid #444",
  padding: "8px",
  textAlign: "left",
  backgroundColor: "#222",
};

const tdStyle = {
  border: "1px solid #444",
  padding: "8px",
};

export default SubsidieOverzicht;