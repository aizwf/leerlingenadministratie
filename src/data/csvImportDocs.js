export function parseDocumentenCSV(csvText) {
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
      "overeenkomst",
      "idbewijs",
      "diploma",
    ];
  
    const ontbrekendeKolommen = verplichteKolommen.filter(
      (kolom) => !headers.includes(kolom)
    );
  
    if (ontbrekendeKolommen.length > 0) {
      return {
        success: false,
        errors: [
          `Ontbrekende kolommen: ${ontbrekendeKolommen.join(", ")}`,
        ],
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
  
      ["overeenkomst", "idbewijs", "diploma"].forEach((veld) => {
        if (rowObject[veld] !== "0" && rowObject[veld] !== "1") {
          errors.push(
            `Regel ${index + 2}: veld '${veld}' moet 0 of 1 zijn.`
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