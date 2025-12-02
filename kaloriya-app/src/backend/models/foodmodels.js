const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
    if (err) console.error("Database connection failed:", err);
    else console.log("Connected to SQLite database");
});

db.run(
    `CREATE TABLE IF NOT EXISTS food (
        food_id INTEGER PRIMARY KEY AUTOINCREMENT,
        food_name TEXT,
        serving_size TEXT,
        calories REAL,
        protein REAL,
        carbohydrates REAL,
        fats REAL
    )`
);

module.exports = db;