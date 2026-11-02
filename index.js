// ---------- Serveur Backend Pokedex ----------
const POKEDEX_SRC = "./DATA/pokedex.json";
const IMAGES_SRC = "./FILES/images";
const PORT = 5001;

const fs = require('fs');

const express = require('express');
const app = express();

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