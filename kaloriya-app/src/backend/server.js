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

  db.get(`SELECT user_id, full_name, email FROM users WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!row) return res.status(404).json({ error: "User not found." });

    res.json(row);
  });
});

app.post("/api/bmi", (req, res) => {
    const { user_id, bmi_value, height_used, weight_used} = req.body;
    
    if (!user_id || !bmi_value || !height_used || !weight_used) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    db.run(
        `INSERT INTO bmi_log 
         (user_id, bmi_value, height_used, weight_used, date_computed) 
         VALUES (?, ?, ?, ?, datetime('now', 'localtime'))`,
        [user_id, bmi_value, height_used, weight_used,],
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


app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  db.get(
    `SELECT * FROM user WHERE email = ?`,
    [email],
    async (err, user) => {
      if (err) return res.status(500).json({ error: "Database error." });

      if (!user)
        return res.status(400).json({ error: "User not found." });

      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.status(400).json({ error: "Incorrect password." });

      // FIXED: Changed user.id to user.user_id and user.username to user.full_name
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

    if (this.changes === 0)
      return res.status(404).json({ error: "User not found." });

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

      if (this.changes === 0)
        return res.status(404).json({ error: "User not found." });

      res.json({ message: "User updated successfully!" });
    }
  );
});

  

//Avocavo Nutrition
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
