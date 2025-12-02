const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
    if (err) console.error("Database connection failed:", err);
    else console.log("Connected to SQLite database");
});

db.run(
    `CREATE TABLE IF NOT EXISTS admin (
        admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_name TEXT,
        email TEXT,
        password TEXT,
        created_at TEXT
    ),

    CREATE TABLE IF NOT EXISTS user (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT,
        email TEXT,
        password TEXT,
        age INTEGER,
        gender TEXT,
        height REAL,
        weight REAL,
        activity_level TEXT,
        created_at TEXT
    ),

    CREATE TABLE IF NOT EXISTS login_log (
        login_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES user(user_id),
        login_timestamp TEXT,
        login_status TEXT,
        ip_address TEXT
    ),

    CREATE TABLE IF NOT EXISTS meal_log (
        meal_log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES user(user_id),
        log_date TEXT,
        meal_type TEXT,
        created_at TEXT
    ),

    CREATE TABLE IF NOT EXISTS bmi_log (
        bmi_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES user(user_id),
        bmi_value REAL,
        height_used REAL,
        weight_used REAL,
        date_computed TEXT
    )

    CREATE TABLE IF NOT EXISTS food (
        food_id INTEGER PRIMARY KEY AUTOINCREMENT,
        food_name TEXT,
        serving_size TEXT,
        calories REAL,
        protein REAL,
        carbohydrates REAL,
        fats REAL
    ),

    CREATE TABLE IF NOT EXISTS meal_item (
        meal_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
        meal_log_id INTEGER,
        FOREIGN KEY (meal_log_id) REFERENCES meal_log(meal_log_id),
        food_id INTEGER,
        FOREIGN KEY (food_id) REFERENCES food(food_id),
        quantity REAL
    )`
);

module.exports = db;