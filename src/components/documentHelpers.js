export function getDocumentenLijst(leerling) {
    return Object.entries(leerling.documenten || {});
  }
  
  export function getAantalOntbrekend(leerling) {
    return getDocumentenLijst(leerling).filter(([, value]) => !value).length;
  }
  
  export function zijnDocumentenCompleet(leerling) {
    return getAantalOntbrekend(leerling) === 0;
  }