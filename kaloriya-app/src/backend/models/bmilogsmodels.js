const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
    if (err) console.error("Database connection failed:", err);
    else console.log("Connected to SQLite database");
});

db.run(
    `CREATE TABLE IF NOT EXISTS bmi_log (
        bmi_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES user(user_id),
        bmi_value REAL,
        height_used REAL,
        weight_used REAL,
        date_computed TEXT
    )`
);

module.exports = db;