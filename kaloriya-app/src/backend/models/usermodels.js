const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
    if (err) console.error("Database connection failed:", err);
    else console.log("Connected to SQLite database");
});

db.run(
    `CREATE TABLE IF NOT EXISTS user (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        age INTEGER,
        gender TEXT,
        height REAL,
        weight REAL,
        activity_level TEXT,
        created_at TEXT
    )`
);

module.exports = db;