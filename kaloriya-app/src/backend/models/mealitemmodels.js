const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
    if (err) console.error("Database connection failed:", err);
    else console.log("Connected to SQLite database");
});

db.run(
    `CREATE TABLE IF NOT EXISTS meal_item (
        meal_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
        meal_log_id INTEGER,
        food_id INTEGER,
        quantity REAL
        FOREIGN KEY (meal_log_id) REFERENCES meal_log(meal_log_id),
        FOREIGN KEY (food_id) REFERENCES food(food_id),
    )`
);

module.exports = db;