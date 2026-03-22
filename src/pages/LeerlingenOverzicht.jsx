import { useMemo, useState } from "react";
import {
  getAantalOntbrekend,
  zijnDocumentenCompleet,
} from "../components/documentHelpers";
import {
  getSignaleringen,
  heeftSignaleringen,
} from "../components/signaleringHelpers";

function LeerlingenOverzicht({ role, onLogout, onSelectLeerling, leerlingen }) {
  // -----------------------------
  // FILTER STATES
  // -----------------------------
  // Hier bewaren we de gekozen filterwaarden.
  // Elke useState hoort bij 1 filter in de UI.
  const [alleenProblemen, setAlleenProblemen] = useState(false);
  const [filterUitDienst, setFilterUitDienst] = useState("alles");
  const [filterActief, setFilterActief] = useState("alles");
  const [filterOnboarding, setFilterOnboarding] = useState("alles");
  const [filterSlb, setFilterSlb] = useState("alle");
  const [filterFunctie, setFilterFunctie] = useState("alle");
  const [filterAfdeling, setFilterAfdeling] = useState("alle");

  // Nieuwe zoekvelden:
  // zoekNaam = zoeken op naam / voornaam / achternaam
  // zoekPersoonsnummer = zoeken op persoonsnummer
  const [zoekNaam, setZoekNaam] = useState("");
  const [zoekPersoonsnummer, setZoekPersoonsnummer] = useState("");

  // Vandaag gebruiken we voor logica zoals:
  // - uit dienst
  // - onboarding o.b.v. datumInDienst
  const vandaag = new Date().toISOString().split("T")[0];

  // -----------------------------
  // UNIEKE WAARDEN VOOR FILTERS
  // -----------------------------
  // Deze lijsten gebruiken we om de dropdowns te vullen.
  // Bijvoorbeeld: alle unieke SLB'ers, functies en afdelingen.
  const uniekeSlbLijst = useMemo(() => {
    return [...new Set(leerlingen.map((leerling) => leerling.slb).filter(Boolean))].sort();
  }, [leerlingen]);

  const uniekeFuncties = useMemo(() => {
    return [...new Set(leerlingen.map((leerling) => leerling.functie).filter(Boolean))].sort();
  }, [leerlingen]);

  const uniekeAfdelingen = useMemo(() => {
    return [...new Set(leerlingen.map((leerling) => leerling.afdeling).filter(Boolean))].sort();
  }, [leerlingen]);

  // -----------------------------
  // RESET FILTERS
  // -----------------------------
  // Zet alle filters en zoekvelden terug naar de beginstand.
  const resetFilters = () => {
    setAlleenProblemen(false);
    setFilterUitDienst("alles");
    setFilterActief("alles");
    setFilterOnboarding("alles");
    setFilterSlb("alle");
    setFilterFunctie("alle");
    setFilterAfdeling("alle");
    setZoekNaam("");
    setZoekPersoonsnummer("");
  };

  // -----------------------------
  // GEFILTERDE LEERLINGEN
  // -----------------------------
  // Hier gebeurt de kern:
  // 1. filteren
  // 2. sorteren
  //
  // useMemo zorgt ervoor dat deze berekening alleen opnieuw draait
  // als 1 van de afhankelijkheden verandert.
  const gefilterdeLeerlingen = useMemo(() => {
    return [...leerlingen]
      .filter((leerling) => {
        // -----------------------------
        // PROBLEMENFILTER
        // -----------------------------
        // Als 'alleen problemen' aan staat, tonen we alleen leerlingen
        // die 1 of meer signaleringen hebben.
        if (alleenProblemen && !heeftSignaleringen(leerling)) {
          return false;
        }

        // -----------------------------
        // AFGELEIDE STATUSLOGICA
        // -----------------------------
        // isUitDienst:
        // als datumUitDienst bestaat en in het verleden ligt, dan uit dienst
        const isUitDienst = leerling.datumUitDienst
          ? leerling.datumUitDienst <= vandaag
          : false;

        // isActiefInOpleiding:
        // gebaseerd op het statusveld
        const isActiefInOpleiding = leerling.status === "Actief in opleiding";

        // isOnboarding:
        // of status = In onboarding
        // of datumInDienst ligt nog in de toekomst
        const isOnboarding =
          leerling.status === "In onboarding" ||
          (leerling.datumInDienst ? leerling.datumInDienst > vandaag : false);

        // -----------------------------
        // FILTERS OP STATUS
        // -----------------------------
        if (filterUitDienst === "ja" && !isUitDienst) return false;
        if (filterUitDienst === "nee" && isUitDienst) return false;

        if (filterActief === "ja" && !isActiefInOpleiding) return false;
        if (filterActief === "nee" && isActiefInOpleiding) return false;

        if (filterOnboarding === "ja" && !isOnboarding) return false;
        if (filterOnboarding === "nee" && isOnboarding) return false;

        // -----------------------------
        // FILTERS OP SLB / FUNCTIE / TEAM
        // -----------------------------
        if (filterSlb !== "alle" && leerling.slb !== filterSlb) return false;
        if (filterFunctie !== "alle" && leerling.functie !== filterFunctie) return false;
        if (filterAfdeling !== "alle" && leerling.afdeling !== filterAfdeling) return false;

        // -----------------------------
        // ZOEKEN OP NAAM
        // -----------------------------
        // We zoeken in:
        // - naam
        // - voornaam
        // - achternaam
        //
        // Alles naar lowercase zodat hoofdletters geen probleem zijn.
        if (zoekNaam.trim() !== "") {
          const zoekterm = zoekNaam.toLowerCase();

          const naamMatch =
            (leerling.naam || "").toLowerCase().includes(zoekterm) ||
            (leerling.voornaam || "").toLowerCase().includes(zoekterm) ||
            (leerling.achternaam || "").toLowerCase().includes(zoekterm);

          if (!naamMatch) return false;
        }

        // -----------------------------
        // ZOEKEN OP PERSOONSNUMMER
        // -----------------------------
        if (zoekPersoonsnummer.trim() !== "") {
          const persoonsnummerMatch = (leerling.persoonsnummer || "")
            .toLowerCase()
            .includes(zoekPersoonsnummer.toLowerCase());

          if (!persoonsnummerMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Leerlingen met meer signaleringen komen bovenaan
        const aSignalen = getSignaleringen(a).length;
        const bSignalen = getSignaleringen(b).length;
        return bSignalen - aSignalen;
      });
  }, [
    leerlingen,
    alleenProblemen,
    filterUitDienst,
    filterActief,
    filterOnboarding,
    filterSlb,
    filterFunctie,
    filterAfdeling,
    zoekNaam,
    zoekPersoonsnummer,
    vandaag,
  ]);

  return (
    <div>
      {/* Paginaheader */}
      <h2 className="page-title">Leerlingen</h2>
      <p>Ingelogd als: {role}</p>

      {/* 
        FILTERBALK
        Sticky: blijft bovenaan zichtbaar tijdens scrollen
      */}
      <div
        className="card"
        style={{
          position: "sticky",
          top: 88,
          zIndex: 5,
          marginTop: 20,
          marginBottom: 16,
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: 12 }}>Filters</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            alignItems: "end",
          }}
        >
          {/* Problemen */}
          <div>
            <label><strong>Problemen</strong></label>
            <br />
            <button onClick={() => setAlleenProblemen(!alleenProblemen)}>
              {alleenProblemen ? "Toon alle leerlingen" : "Toon alleen problemen"}
            </button>
          </div>

          {/* Zoeken op naam / voornaam / achternaam */}
          <div>
            <label><strong>Zoek op naam</strong></label>
            <br />
            <input
              type="text"
              value={zoekNaam}
              onChange={(e) => setZoekNaam(e.target.value)}
              placeholder="Bijv. Yasmine"
            />
          </div>

          {/* Zoeken op persoonsnummer */}
          <div>
            <label><strong>Persoonsnummer</strong></label>
            <br />
            <input
              type="text"
              value={zoekPersoonsnummer}
              onChange={(e) => setZoekPersoonsnummer(e.target.value)}
              placeholder="Bijv. P10021"
            />
          </div>

          {/* Uit dienst */}
          <div>
            <label><strong>Uit dienst</strong></label>
            <br />
            <select
              value={filterUitDienst}
              onChange={(e) => setFilterUitDienst(e.target.value)}
            >
              <option value="alles">Alles</option>
              <option value="ja">Alleen uit dienst</option>
              <option value="nee">Niet uit dienst</option>
            </select>
          </div>

          {/* Actief in opleiding */}
          <div>
            <label><strong>Actief in opleiding</strong></label>
            <br />
            <select
              value={filterActief}
              onChange={(e) => setFilterActief(e.target.value)}
            >
              <option value="alles">Alles</option>
              <option value="ja">Alleen actief</option>
              <option value="nee">Niet actief</option>
            </select>
          </div>

          {/* Onboarding */}
          <div>
            <label><strong>Onboarding</strong></label>
            <br />
            <select
              value={filterOnboarding}
              onChange={(e) => setFilterOnboarding(e.target.value)}
            >
              <option value="alles">Alles</option>
              <option value="ja">Alleen onboarding</option>
              <option value="nee">Niet onboarding</option>
            </select>
          </div>

          {/* SLB */}
          <div>
            <label><strong>SLB</strong></label>
            <br />
            <select value={filterSlb} onChange={(e) => setFilterSlb(e.target.value)}>
              <option value="alle">Alle SLB&apos;ers</option>
              {uniekeSlbLijst.map((slbNaam) => (
                <option key={slbNaam} value={slbNaam}>
                  {slbNaam}
                </option>
              ))}
            </select>
          </div>

          {/* Functie */}
          <div>
            <label><strong>Functie</strong></label>
            <br />
            <select
              value={filterFunctie}
              onChange={(e) => setFilterFunctie(e.target.value)}
            >
              <option value="alle">Alle functies</option>
              {uniekeFuncties.map((functie) => (
                <option key={functie} value={functie}>
                  {functie}
                </option>
              ))}
            </select>
          </div>

          {/* Team / afdeling */}
          <div>
            <label><strong>Team</strong></label>
            <br />
            <select
              value={filterAfdeling}
              onChange={(e) => setFilterAfdeling(e.target.value)}
            >
              <option value="alle">Alle teams</option>
              {uniekeAfdelingen.map((afdeling) => (
                <option key={afdeling} value={afdeling}>
                  {afdeling}
                </option>
              ))}
            </select>
          </div>

          {/* Reset */}
          <div>
            <label><strong>&nbsp;</strong></label>
            <br />
            <button onClick={resetFilters}>Reset filters</button>
          </div>
        </div>
      </div>

      {/* Telling van het aantal leerlingen na filtering */}
      <div className="card" style={{ marginBottom: 16 }}>
        <strong>Aantal leerlingen:</strong> {gefilterdeLeerlingen.length}
      </div>

      {/* Lijst met leerlingkaarten */}
      {gefilterdeLeerlingen.map((leerling) => {
        const aantalOntbrekend = getAantalOntbrekend(leerling);
        const compleet = zijnDocumentenCompleet(leerling);
        const signaleringen = getSignaleringen(leerling);

        return (
          <div
            key={leerling.id}
            onClick={() => onSelectLeerling(leerling)}
            className="card"
            style={{ marginBottom: 12, cursor: "pointer" }}
          >
            <div>
              <strong>{leerling.naam}</strong>
            </div>
            <div>
              {leerling.persoonsnummer}-{leerling.dienstverbandnr}
            </div>
            <div>{leerling.afdeling}</div>
            <div>{leerling.functie}</div>
            <div>SLB: {leerling.slb || "-"}</div>

            {/* Badges */}
            <div style={{ marginTop: 8 }}>
              <span
                className={`badge ${
                  leerling.status === "Actief in opleiding"
                    ? "badge-green"
                    : leerling.status === "In onboarding"
                    ? "badge-orange"
                    : "badge-gray"
                }`}
                style={{ marginRight: 8 }}
              >
                {leerling.status}
              </span>

              <span
                className={`badge ${
                  compleet ? "badge-green" : "badge-orange"
                }`}
              >
                {compleet
                  ? "Documenten compleet"
                  : `${aantalOntbrekend} ontbrekend`}
              </span>
            </div>

            {/* Signaleringen */}
            {signaleringen.length > 0 && (
              <div style={{ marginTop: 8 }}>
                {signaleringen.map((signaal, index) => (
                  <div
                    key={index}
                    style={{
                      fontSize: 12,
                      color: "orange",
                      marginTop: 4,
                    }}
                  >
                    ⚠ {signaal}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Geen resultaten */}
      {gefilterdeLeerlingen.length === 0 && (
        <div className="card">Geen leerlingen gevonden met deze filters.</div>
      )}

      <button onClick={onLogout}>Uitloggen</button>
    </div>
  );
}

export default LeerlingenOverzicht;