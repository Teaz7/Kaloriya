const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
    if (err) console.error("Database connection failed:", err);
    else console.log("Connected to SQLite database");
});

db.run(
    `CREATE TABLE IF NOT EXISTS meal_log (
        meal_log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        log_date TEXT,
        meal_type TEXT,
        created_at TEXT,
        FOREIGN KEY (user_id) REFERENCES user(user_id),
    )`
);

module.exports = db;