# Plantilla projecte NodeJS amb Maven DAM2-MP06 #

# Estructura de Carpetes API

Dins del directori `api`, trobem diverses subcarpetes que organitzen el codi de l'aplicació segons diferents responsabilitats. Aquesta estructura ajuda a mantenir el codi net, modular i fàcil de mantenir.

## controllers

Els `controllers` són responsables de gestionar la lògica d'aplicació. Quan una ruta rep una petició, el controlador processa aquesta petició, interactua amb models o serveis si és necessari, i finalment retorna una resposta al client.

### Contingut:

- Funcions que manejen peticions HTTP (GET, POST, PUT, DELETE, etc.).
- Interacció amb els models de dades per a consultes a la base de dades.
- Validació de dades d'entrada i maneig d'errors.
- Enviament de respostes HTTP amb els resultats o missatges d'error corresponents.

## middlewares

Els `middlewares` són funcions que s'executen entre la petició entrant i el controlador que finalment processa la petició. S'utilitzen per a tasques com la verificació d'autenticació, el registre, la manipulació de peticions i respostes, i el maneig d'errors.

### Contingut:

- Autenticació i autorització.
- Validació de tokens o sessions.
- Registre de peticions.
- Tractament d'errors globals.
- Cors i seguretat addicional.

## models

Els `models` defineixen l'estructura de les dades que s'utilitzen dins de l'aplicació, normalment corresponent a les col·leccions o taules de la base de dades. S'utilitzen per a interactuar amb la base de dades per a crear, llegir, actualitzar i eliminar dades (CRUD).

### Contingut:

- Esquemes de Mongoose per a MongoDB.
- Definicions de models Sequelize per a SQL.
- Mètodes personalitzats per a manipulació de models.

## routes

Les `routes` defineixen els endpoints de l'API i associen peticions HTTP entrants amb els controladors específics que haurien de manejar-les.

### Contingut:

- Definició dels endpoints de l'API.
- Associació de rutes amb les funcions dels controladors.
- Especificació dels mètodes HTTP (GET, POST, PUT, DELETE).

## services

Els `services` contenen la lògica d'aplicació reutilitzable que no està directament lligada a les peticions i respostes HTTP. Això pot incloure la lògica de negoci, com ara operacions de base de dades, integracions de tercers i algorismes complexos.

### Contingut:

- Operacions de base de dades reutilitzables.
- Comunicació amb serveis externs o APIs.
- Funcions d'ajuda per a realitzar tasques comunes dins de l'aplicació.


# Arrencada ràpida de l'API ##
```
npm run clean
npm install
npm run build
npm start
```

# MongoDB, posada en marxa
Consultar readme.md dins del directori ./etc/mongdb-docker
Un cop arrencat, assegurar-se de crear la base de dades "dam2-mp06-uf04" (A través de la interfície web)
Un cop arrencat, assegurar-se de crear la base de dades "dam2-mp06-uf04-test" (A través de la interfície web)


# Execució eines importació
node src/utils/import_posts.js
node src/utils/import_users.js


# Tests
## Exemple d'insersió d'un esdeveniment
curl -X POST http://localhost:3000/api/events \
-H "Content-Type: application/json" \
-d '{"name":"Event Name","date":"2023-04-05T09:00:00Z","description":"Event Description"}'

