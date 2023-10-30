require("dotenv").config();

module.exports = {
  database: {
    connectionString: process.env.MONGO_CONNECTION_STRING, // Stringa di connessione
    databaseName: "mainDB", // Nome del database principale
  },
  cors: {
    origin: "*", // Impostazioni di cors.
  },
  api: {
    port: 3001, // Porta del back-end
  },
  projects: {
    resultsPerPage: 12, // Risultati per pagina
  },
  accounts: {
    saltRounds: 10, // Giri di sale
    adminKey: process.env.ADMIN_KEY, // Chiave admin per la registrazione
    secretJWT: process.env.JWT_SECRET,
  },
};
