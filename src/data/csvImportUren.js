export function parseUrenCSV(csvText) {
  const regels = csvText.trim().split("\n").filter((regel) => regel.trim() !== "");

  if (regels.length < 2) {
    return {
      success: false,
      errors: ["Het CSV-bestand bevat geen gegevens."],
      rows: [],
    };
  }

  const headers = regels[0].split(",").map((h) => h.trim());

  const verplichteKolommen = [
    "persoonsnummer",
    "dienstverbandnr",
    "datum",
    "gewerkteUren",
    "ziekteverzuimuren",
    "verlofuren",
  ];

  const ontbrekendeKolommen = verplichteKolommen.filter(
    (kolom) => !headers.includes(kolom)
  );

  if (ontbrekendeKolommen.length > 0) {
    return {
      success: false,
      errors: [`Ontbrekende kolommen: ${ontbrekendeKolommen.join(", ")}`],
      rows: [],
    };
  }

  const errors = [];
  const rows = regels.slice(1).map((regel, index) => {
    const waarden = regel.split(",").map((v) => v.trim());
    const rowObject = {};

    headers.forEach((header, colIndex) => {
      rowObject[header] = waarden[colIndex] ?? "";
    });

    ["gewerkteUren", "ziekteverzuimuren", "verlofuren"].forEach((veld) => {
      const waarde = rowObject[veld];
      if (waarde === "" || Number.isNaN(Number(waarde))) {
        errors.push(
          `Regel ${index + 2}: veld '${veld}' moet een getal zijn.`
        );
      }
    });

    return rowObject;
  });

  return {
    success: errors.length === 0,
    errors,
    rows,
  };
}