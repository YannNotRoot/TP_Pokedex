// ---------- Serveur Backend Pokedex ----------
const POKEDEX_SRC = "./DATA/pokedex.json";
const IMAGES_SRC = "./FILES/images";
const PORT = 5001;

const fs = require('fs');

const express = require('express');
const app = express();

/**
* Fonction qui va limiter le nombre de requêtes par IP sur une période donnée
*
* @param {*} req
* @param {*} maxRequests
* @param {*} timeWindow
* @returns boolean
*/
function limitRequests(request, maxRequests = 10, timeWindow = 60000) {
    // Récupération de l'adresse IP contenue dans la requête
    const ip = request.ip;

    // Définition d'un booléen d'autorisation de la requête
    let requestAuthorized = true;

    // Récupération du moment actuel
    const currentTime = Date.now();
    
    // Dans l'objet **Application** de l'objet **request** on ajoute un tableau de **comptage des requêtes**
    if (!request.app.locals.requestCounts) {
    request.app.locals.requestCounts = {};
    }

    //console.log(request.app.locals.requestCounts);

    // On y ajoute l'adresse IP de la requête (un **timestamp** est automatiquement ajouté)
    if (!request.app.locals.requestCounts[ip]) {
        request.app.locals.requestCounts[ip] = [];
    }

    // Si l'adresse IP est déjà présente dans ce tableau ET que son **timestamp** est trop ancien, on le supprime
    request.app.locals.requestCounts[ip] = request.app.locals.requestCounts[ip].filter(
    (timestamp) => currentTime - timestamp < timeWindow
    );

    // S'il y a plus d'entrée correspondante à cette adresse IP que la limite, la requête est refusée, sinon on ajoute le **timestamp** de la requête dans le tableau
    if (request.app.locals.requestCounts[ip].length >= maxRequests) {
    requestAuthorized = false;
    }else{
    // on ajoute le **timestamp** de la requête dans le tableau
    request.app.locals.requestCounts[ip].push(currentTime);
    }

    // Renvoi du jeton d'autorisation
    return requestAuthorized;
}

function checkRequests(request, response, next) {

    if (!limitRequests(request, 10, 60000)) {

        console.log(`Too many requests from IP: ${request.ip}`);

        return response.status(429).json({
            message: "Too many requests. Please try again later.",
        });
    }

    next();
}

// ---------- Fonctions Pokedex ----------

// Get all Pokemons
function findAll(request, response) {
    // Read JSON file
    fs.readFile(POKEDEX_SRC, "utf8", (err, data) => {
        // Handle error
        if (err) {
            return response.status(500).json({
                error: "Perte du réseau Pokedex"
            });
        }

        // Parse JSON
        const pokemons = JSON.parse(data);
        response.json(pokemons);

    });
};

// Get random Pokemon
function findOneByRandom(request, response) {
    fs.readFile(POKEDEX_SRC, "utf8", (err, data) => {
        // Handle error
        if (err) {
            return response.status(500).json({
                error: "Erreur lors de la lecture du Pokedex"
            });
        }

        // Parse JSON
        const pokemons = JSON.parse(data);
        // Generate random index
        const randomIndex = Math.floor(Math.random() * pokemons.length);
        // Get random Pokemon
        const randomPokemon = pokemons[randomIndex];
        response.json(randomPokemon);
    });
};


// Get Pokemon by name
function findOneByName(request, response, next) {

    // Get URL name
    const name = request.params.name;

    // Skip numeric IDs
    if (/^\d+$/.test(name)) {
        return next();
    }

    // Read JSON file
    fs.readFile(POKEDEX_SRC, "utf8", (err, data) => {
        if (err) {
            return response.status(500).json({
                error: "Erreur lors de la lecture du Pokedex"
            });
        }

        // Parse JSON
        const pokemons = JSON.parse(data);
        // Find Pokemon by name
        const pokemon = pokemons.find(p => String(p.name.english).toLowerCase() === name.toLowerCase());
        // Check if Pokemon exists
        if (!pokemon) {
            return response.status(404).json({
                error: "Pokemon introuvable"
            });
        }
        response.json(pokemon);

    });

};

// Get Pokemon by ID
function findOneById(request, response) {
    fs.readFile(POKEDEX_SRC, "utf8", (err, data) => {
        const id = Number(request.params.id);
        if (!Number.isInteger(id)) {
            return response.status(404).json({
                error: "Pokemon introuvable"
            });
        }

        // Parse JSON
        const pokemons = JSON.parse(data);
        // Find Pokemon
        const pokemon = pokemons.find(p => p.id === id);

        // Check if Pokemon exists
        if(!pokemon){
            return response.status(404).json({
                error: "Pokemon introuvable"
            });
        }
        response.json(pokemon);
    });
};

app.use(checkRequests);
// ---------- Routes ----------

app.get("/api/v1/pokemons", findAll);

app.get("/api/v1/pokemons/random", findOneByRandom);

app.get("/api/v1/pokemons/:name", findOneByName);

app.get("/api/v1/pokemons/:id", findOneById);

// ---------- Start server ----------
app.listen(
    PORT,
    '127.0.0.1'
    ,
    () => {
    console.log('Server Pokedex is listening on ' + PORT);
    }
)