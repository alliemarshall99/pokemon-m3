let express = require("express");
let app = new express();                                                                     

// set up database connection
const knex = require("knex")({
 client: "mysql",
 connection: {
  host:"pokemon-db-m3.c3ecoy4ow5eq.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "Password1",
  database:"pokedb",
  port: 3306,
 },
});

// Main route - loads a default Pokémon type (e.g., 'electric')
app.get("/", (req, res) => {
  knex
    .select("image_url", "pokemon_name", "pokedex_number")
    .from("electric") // Default to 'electric' table for initial load
    .then((result) => {
      console.log("Fetched data:", result); // Log the fetched data
      res.render("index", { images: result });
    })
    .catch((error) => {
      console.error("Error fetching Pokémon data:", error);
      res.status(500).send("Error fetching data");
    });
});

// Dynamic route for different Pokémon types
app.get("/:type", (req, res) => {
  const type = req.params.type;

  // Validate that the requested type is a valid table
  const validTypes = [
    "bug", "dragon", "electric", "fighting", "fire", 
    "flying", "ghost", "grass", "ground", "ice", 
    "normal", "poison", "psychic", "rock", "water"
  ];
  
  if (!validTypes.includes(type)) {
    return res.status(400).send("Invalid Pokémon type");
  }

  knex
    .select("image_url", "pokemon_name", "pokedex_number")
    .from(type) // Query the specific type table
    .then((result) => {
      res.json(result); // Return data as JSON for AJAX request
    })
    .catch((error) => {
      console.error(`Error fetching ${type} Pokémon data:`, error);
      res.status(500).send("Error fetching data");
    });
});

app.listen(3000);
