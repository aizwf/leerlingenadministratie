export function parseHrCSV(csvText) {
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
        "naam",
        "afdeling",
        "functie",
        "bsn",
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
  
    const rows = regels.slice(1).map((regel) => {
      const waarden = regel.split(",").map((v) => v.trim());
      const rowObject = {};
  
      headers.forEach((header, index) => {
        rowObject[header] = waarden[index] ?? "";
      });
  
      return rowObject;
    });
  
    return {
      success: true,
      errors: [],
      rows,
    };
  }