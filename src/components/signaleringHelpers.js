import { getAantalOntbrekend } from "./documentHelpers";

export function getSignaleringen(leerling) {
  const signaleringen = [];

  // 1. Geen diplomadatum
  if (!leerling.verwachteDiplomadatum) {
    signaleringen.push("Geen verwachte diplomadatum");
  } else {
    // 2. Diplomadatum binnen 90 dagen
    const vandaag = new Date();
    const diplomaDatum = new Date(leerling.verwachteDiplomadatum);

    const verschilInDagen =
      (diplomaDatum - vandaag) / (1000 * 60 * 60 * 24);

    if (verschilInDagen > 0 && verschilInDagen < 90) {
      signaleringen.push("Diplomadatum binnen 90 dagen");
    }
  }

  // 3. Documenten ontbreken
  const aantalOntbrekend = getAantalOntbrekend(leerling);
  if (aantalOntbrekend > 0) {
    signaleringen.push(`${aantalOntbrekend} document(en) ontbreken`);
  }

  // 4. Geen SLB gekoppeld
  if (!leerling.slb) {
    signaleringen.push("Geen SLB gekoppeld");
  }

  // 5. Onboarding zonder startdatum
  if (
    leerling.status === "In onboarding" &&
    !leerling.startdatum
  ) {
    signaleringen.push("Onboarding zonder startdatum");
  }

  return signaleringen;
}

export function heeftSignaleringen(leerling) {
  return getSignaleringen(leerling).length > 0;
}