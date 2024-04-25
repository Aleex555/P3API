#!/bin/bash

# Estableix la codificació de sortida de la consola
export LC_ALL="ca_ES.UTF-8"

# Assegura't que qualsevol error aturi el script
set -e

# Neteja el projecte
echo "Netejant el projecte..."
npm run clean

# Instal·la les dependències
echo "Instal·lant dependències..."
npm install

# Construeix el projecte
echo "Construint el projecte..."
npm run build

# Executa els tests
echo "Executant tests..."
npm run test

echo "¡Script completat amb èxit!"
