const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
    if (err) console.error("Database connection failed:", err);
    else console.log("Connected to SQLite database");
});

db.run(
    `CREATE TABLE IF NOT EXISTS login_log (
        login_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES user(user_id),
        login_timestamp TEXT,
        login_status TEXT,
        ip_address TEXT
    )`
);

module.exports = db;