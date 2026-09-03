export function validateName(name: string) {
    if (!name) return false;
    return !!name.match(/[a-zA-ZàáâãäçéêëíîïóôõöúûüÀÁÂÃÄÇÉÊËÍÎÏÓÔÕÖÚÛÜ]+ [a-zA-ZàáâãäçéêëíîïóôõöúûüÀÁÂÃÄÇÉÊËÍÎÏÓÔÕÖÚÛÜ]+/);
}