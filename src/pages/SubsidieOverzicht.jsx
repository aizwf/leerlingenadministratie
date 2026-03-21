import { useMemo, useState } from "react";

function SubsidieOverzicht({ leerlingen, urenData }) {
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
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
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
    <div className="container">
      <h2 className="page-title">Subsidieoverzicht</h2>

      <div className="card" style={{ marginTop: 20, marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "end",
            flexWrap: "wrap",
          }}
        >
          <div>
            <label>
              <strong>Van datum</strong>
            </label>
            <br />
            <input
              type="date"
              value={vanDatum}
              onChange={(e) => setVanDatum(e.target.value)}
            />
          </div>

          <div>
            <label>
              <strong>T/m datum</strong>
            </label>
            <br />
            <input
              type="date"
              value={totEnMetDatum}
              onChange={(e) => setTotEnMetDatum(e.target.value)}
            />
          </div>

          <button onClick={handleExportCsv}>Exporteer CSV</button>

        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <strong>Aantal leerlingen in periode:</strong> {gefilterdeLeerlingen.length}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>BSN</th>
              <th>Voornaam</th>
              <th>Achternaam</th>
              <th>Opleiding</th>
              <th>Leerweg</th>
              <th>Niveau</th>
              <th>Startdatum</th>
              <th>Einddatum</th>
              <th>Crebonummer</th>
              <th>Gewerkte uren</th>
              <th>Ziekteverzuimuren</th>
              <th>Verlofuren</th>
            </tr>
          </thead>
          <tbody>
            {gefilterdeLeerlingen.map((leerling) => (
              <tr key={leerling.id}>
                <td>{leerling.bsn}</td>
                <td>{leerling.voornaam}</td>
                <td>{leerling.achternaam}</td>
                <td>{leerling.opleiding}</td>
                <td>{leerling.leerweg}</td>
                <td>{leerling.niveau}</td>
                <td>{leerling.startdatum}</td>
                <td>{leerling.einddatum || vandaag}</td>
                <td>{leerling.crebonummer}</td>
                <td>{leerling.gewerkteUren}</td>
                <td>{leerling.ziekteverzuimuren}</td>
                <td>{leerling.verlofuren}</td>
              </tr>
            ))}

            {gefilterdeLeerlingen.length === 0 && (
              <tr>
                <td colSpan={12}>Geen leerlingen gevonden binnen deze periode.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SubsidieOverzicht;