// userServices.js

/**
 * Calcula l'edat mitjana dels usuaris proporcionats.
 * @param {Array} users - Un array d'objectes on cada objecte representa un usuari i conté una propietat `birthDate`.
 * @returns {Number} L'edat mitjana dels usuaris, o 0 si no hi ha usuaris.
 */
function calculateAverageAge(users) {
  // Utilitza `reduce` per sumar les edats de tots els usuaris. Comença amb un total de 0.
  const totalAge = users.reduce((acc, user) => {
    // Converteix la data de naixement de l'usuari a un objecte `Date`.
    const birthDate = new Date(user.birthDate);
    // Calcula l'edat de l'usuari com la diferència entre l'any actual i l'any de naixement.
    const age = new Date().getFullYear() - birthDate.getFullYear() + 1;
    // Afegeix l'edat de l'usuari actual al total acumulat.
    return acc + age;
  }, 0);
  
  // Calcula l'edat mitjana dividint el total d'edats pel nombre d'usuaris.
  // Retorna 0 si l'array d'usuaris és buit per evitar la divisió per zero.
  return users.length > 0 ? totalAge / users.length : 0;
}

// Exporta la funció `calculateAverageAge` perquè pugui ser utilitzada en altres parts de l'aplicació.
module.exports = { calculateAverageAge };
