# 🚀 Pokedex API - Backend

Serveur backend Node.js / Express

## 📂 Arborescence du projet

```text
BACKEND/
├── DATA/
│   ├── items.json
│   ├── moves.json
│   ├── pokedex.json
│   └── types.json
├── FILES/
│   ├── images/
│   ├── sprites/
│   └── thumbnails/
├── index.js
└── README.md

```

## ⚙️ Prérequis et Installation

1. **Cloner le dépôt** et se placer dans le dossier `BACKEND`.
2. **Installer les dépendances** :


```bash
npm install express
```



## 🚀 Lancement du serveur

* En mode standard :
```bash
node index.js
```


* En mode monitoring (rechargement automatique) :


```bash
node --watch index.js
```



Le serveur écoute par défaut sur l'adresse `http://127.0.0.1:5001`.

## 🔌 Endpoints de l'API

Toutes les routes de l'API sont préfixées par `/api/v1/` :

* GET `/api/v1/pokemons` : Renvoie la liste de tous les Pokémon.


* GET `/api/v1/pokemons/random` : Renvoie un Pokémon aléatoire.


* GET `/api/v1/pokemons/:id` : Renvoie un Pokémon selon son identifiant numérique (renvoie `404` si introuvable).


* GET `/api/v1/pokemons/:name` : Renvoie un Pokémon selon son nom (renvoie `404` si introuvable).



## 🛡️ Sécurité

Un système de limitation de requêtes (*Rate Limiting*) par adresse IP est actif globalement sur l'API (maximum 10 requêtes par minute).


> README made by chatGPT
