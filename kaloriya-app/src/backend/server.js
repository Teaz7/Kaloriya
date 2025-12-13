const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const request = require("request");
const db = require("./models/usermodels");

const date = new Date().toISOString().split("T")[0];
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Create tables
db.run(
    `CREATE TABLE IF NOT EXISTS bmi_log (
        bmi_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        bmi_value REAL,
        height_used REAL,
        weight_used REAL,
        date_computed TEXT,
        FOREIGN KEY (user_id) REFERENCES user(user_id)
    )`
);

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

db.run(
    `CREATE TABLE IF NOT EXISTS meal_log (
        meal_log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        log_date TEXT,
        meal_type TEXT,
        created_at TEXT,
        FOREIGN KEY (user_id) REFERENCES user(user_id)
    )`
);

db.run(
    `CREATE TABLE IF NOT EXISTS meal_item (
        meal_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
        meal_log_id INTEGER,
        food_id INTEGER,
        quantity REAL,
        FOREIGN KEY (meal_log_id) REFERENCES meal_log(meal_log_id),
        FOREIGN KEY (food_id) REFERENCES food(food_id)
    )`
);

// ===== USER ROUTES =====
app.post("/register", async (req, res) => {
  const { fullname, email, password, age, gender, height, weight } = req.body;

  if (!fullname || !email || !password || !age || !gender || !height || !weight)
    return res.status(400).json({ error: "All fields are required." });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO user (full_name, email, password, age, gender, height, weight, activity_level, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fullname, email, hashedPassword, age, gender, height, weight, "", date],
      function (err) {
        if (err) {
          console.error(err);
          if (err.message.includes("UNIQUE constraint failed")) {
            return res.status(400).json({ error: "Username or email already exists." });
          }
          return res.status(500).json({ error: "Database error." });
        }
        res.json({ message: "User registered successfully!", userId: this.lastID });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

app.get("/user", (req, res) => {
  db.all(`SELECT user_id, full_name, email FROM user`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/user/:id", (req, res) => {
  const { id } = req.params;

  db.get(`SELECT user_id, full_name, email FROM user WHERE user_id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "User not found." });
    res.json(row);
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  db.get(
    `SELECT * FROM user WHERE email = ?`,
    [email],
    async (err, user) => {
      if (err) return res.status(500).json({ error: "Database error." });
      if (!user) return res.status(400).json({ error: "User not found." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Incorrect password." });

      res.json({
        message: "Login successful!",
        user: {
          id: user.user_id,
          username: user.full_name,
          email: user.email,
        },
      });
    }
  );
});

app.delete("/user/:id", (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM user WHERE user_id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "User not found." });
    res.json({ message: "User deleted successfully!" });
  });
});

app.put("/user/:id", (req, res) => {
  const { id } = req.params;
  const { fullname, email } = req.body;

  db.run(
    `UPDATE user SET full_name = ?, email = ? WHERE user_id = ?`,
    [fullname, email, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "User not found." });
      res.json({ message: "User updated successfully!" });
    }
  );
});

// ===== BMI ROUTES =====
app.post("/api/bmi", (req, res) => {
    const { user_id, bmi_value, height_used, weight_used } = req.body;
    
    if (!user_id || !bmi_value || !height_used || !weight_used) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    db.run(
        `INSERT INTO bmi_log 
         (user_id, bmi_value, height_used, weight_used, date_computed) 
         VALUES (?, ?, ?, ?, datetime('now', 'localtime'))`,
        [user_id, bmi_value, height_used, weight_used],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({
                bmi_id: this.lastID,
                message: "BMI log added successfully"
            });
        }
    );
});

app.get("/api/bmi/:userId", (req, res) => {
    const { userId } = req.params;
    
    db.all(
        `SELECT * FROM bmi_log 
         WHERE user_id = ? 
         ORDER BY date_computed DESC 
         LIMIT 20`,
        [userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
});

// ===== FOOD ROUTES =====
app.post("/api/food", (req, res) => {
    const { food_name, serving_size, calories, protein, carbohydrates, fats } = req.body;
    
    if (!food_name) {
        return res.status(400).json({ error: "Food name is required" });
    }
    
    // Check if food already exists
    db.get(
        `SELECT * FROM food WHERE food_name = ? AND serving_size = ?`,
        [food_name, serving_size],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            if (row) {
                // Food already exists, return existing food
                return res.json({
                    food_id: row.food_id,
                    message: "Food already exists",
                    existing: true
                });
            }
            
            // Insert new food
            db.run(
                `INSERT INTO food (food_name, serving_size, calories, protein, carbohydrates, fats) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [food_name, serving_size, calories || 0, protein || 0, carbohydrates || 0, fats || 0],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({
                        food_id: this.lastID,
                        message: "Food added successfully",
                        existing: false
                    });
                }
            );
        }
    );
});

app.get("/api/food", (req, res) => {
    db.all(`SELECT * FROM food ORDER BY food_name`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get("/api/food/:id", (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM food WHERE food_id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Food not found." });
        res.json(row);
    });
});

// ===== MEAL LOG ROUTES =====
app.post("/api/meal-log", (req, res) => {
    const { user_id, log_date, meal_type } = req.body;
    
    if (!user_id || !log_date || !meal_type) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    const created_at = new Date().toISOString();
    
    db.run(
        `INSERT INTO meal_log (user_id, log_date, meal_type, created_at) 
         VALUES (?, ?, ?, ?)`,
        [user_id, log_date, meal_type, created_at],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({
                meal_log_id: this.lastID,
                message: "Meal log created successfully"
            });
        }
    );
});

app.get("/api/meal-log/:userId", (req, res) => {
    const { userId } = req.params;
    
    db.all(
        `SELECT ml.*, 
                GROUP_CONCAT(f.food_name) as foods
         FROM meal_log ml
         LEFT JOIN meal_item mi ON ml.meal_log_id = mi.meal_log_id
         LEFT JOIN food f ON mi.food_id = f.food_id
         WHERE ml.user_id = ?
         GROUP BY ml.meal_log_id
         ORDER BY ml.log_date DESC, ml.created_at DESC
         LIMIT 50`,
        [userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
});

// ===== MEAL ITEM ROUTES =====
app.post("/api/meal-item", (req, res) => {
    const { meal_log_id, food_id, quantity } = req.body;
    
    if (!meal_log_id || !food_id || !quantity) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    db.run(
        `INSERT INTO meal_item (meal_log_id, food_id, quantity) 
         VALUES (?, ?, ?)`,
        [meal_log_id, food_id, quantity],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({
                meal_item_id: this.lastID,
                message: "Meal item added successfully"
            });
        }
    );
});

app.get("/api/meal-item/:mealLogId", (req, res) => {
    const { mealLogId } = req.params;
    
    db.all(
        `SELECT mi.*, f.* 
         FROM meal_item mi
         JOIN food f ON mi.food_id = f.food_id
         WHERE mi.meal_log_id = ?`,
        [mealLogId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
});

// ===== COMPLETE MEAL ADDITION (Combined endpoint) =====
app.post("/api/add-meal", async (req, res) => {
    const { user_id, log_date, meal_type, foods } = req.body;
    
    if (!user_id || !log_date || !meal_type || !foods || foods.length === 0) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    try {
        // Step 1: Create meal log
        const created_at = new Date().toISOString();
        
        db.run(
            `INSERT INTO meal_log (user_id, log_date, meal_type, created_at) 
             VALUES (?, ?, ?, ?)`,
            [user_id, log_date, meal_type, created_at],
            function(mealLogErr) {
                if (mealLogErr) {
                    return res.status(500).json({ error: mealLogErr.message });
                }
                
                const meal_log_id = this.lastID;
                let itemsProcessed = 0;
                const mealItems = [];
                
                // Step 2: Process each food item
                foods.forEach((food) => {
                    const { food_name, serving_size, calories, protein, carbohydrates, fats, quantity } = food;
                    
                    // Check if food exists
                    db.get(
                        `SELECT * FROM food WHERE food_name = ? AND serving_size = ?`,
                        [food_name, serving_size],
                        (err, row) => {
                            if (err) {
                                return res.status(500).json({ error: err.message });
                            }
                            
                            const insertMealItem = (food_id) => {
                                db.run(
                                    `INSERT INTO meal_item (meal_log_id, food_id, quantity) 
                                     VALUES (?, ?, ?)`,
                                    [meal_log_id, food_id, quantity],
                                    function(itemErr) {
                                        if (itemErr) {
                                            return res.status(500).json({ error: itemErr.message });
                                        }
                                        
                                        mealItems.push({
                                            meal_item_id: this.lastID,
                                            food_id,
                                            quantity
                                        });
                                        
                                        itemsProcessed++;
                                        
                                        if (itemsProcessed === foods.length) {
                                            res.json({
                                                meal_log_id,
                                                meal_items: mealItems,
                                                message: "Meal added successfully"
                                            });
                                        }
                                    }
                                );
                            };
                            
                            if (row) {
                                // Food exists, use existing food_id
                                insertMealItem(row.food_id);
                            } else {
                                // Food doesn't exist, insert new food
                                db.run(
                                    `INSERT INTO food (food_name, serving_size, calories, protein, carbohydrates, fats) 
                                     VALUES (?, ?, ?, ?, ?, ?)`,
                                    [food_name, serving_size, calories || 0, protein || 0, carbohydrates || 0, fats || 0],
                                    function(foodErr) {
                                        if (foodErr) {
                                            return res.status(500).json({ error: foodErr.message });
                                        }
                                        insertMealItem(this.lastID);
                                    }
                                );
                            }
                        }
                    );
                });
            }
        );
    } catch (err) {
        res.status(500).json({ error: "Server error: " + err.message });
    }
});

// ===== NUTRITION API ROUTES =====
app.post("/api/nutrition/ingredient", (req, res) => {
  console.log("Received request:", req.body);

  const { ingredient } = req.body;

  const options = {
    url: "https://app.avocavo.app/api/v2/nutrition/ingredient",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": "sk_welcome_api_key_098adnj59tzfgekyg7xn6vl",
    },
    body: JSON.stringify({ ingredient }),
  };

  request(options, (error, response, body) => {
    if (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Request failed" });
    }

    try {
      const data = JSON.parse(body);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to parse response" });
    }
  });
});

app.post("/api/nutrition/recipe", (req, res) => {
  console.log("Received request:", req.body);

  const { ingredient } = req.body;

  const options = {
    url: "https://app.avocavo.app/api/v2/nutrition/recipe",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": "sk_welcome_api_key_098adnj59tzfgekyg7xn6vl",
    },
    body: JSON.stringify({ ingredient }),
  };

  request(options, (error, response, body) => {
    if (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Request failed" });
    }

    try {
      const data = JSON.parse(body);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to parse response" });
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));