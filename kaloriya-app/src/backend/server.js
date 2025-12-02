const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const db = require("./models/usermodels");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Register a new user
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ error: "All fields are required." });

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    db.run(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, hashedPassword],
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

//  Get all users (for testing)
app.get("/users", (req, res) => {
  db.all(`SELECT id, username, email FROM users`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// Get single user by ID
app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  db.get(`SELECT id, username, email FROM users WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!row) return res.status(404).json({ error: "User not found." });

    res.json(row);
  });
});




// User Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Username and password are required." });

  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    async (err, user) => {
      if (err) return res.status(500).json({ error: "Database error." });

      if (!user)
        return res.status(400).json({ error: "User not found." });

      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.status(400).json({ error: "Incorrect password." });

      res.json({
        message: "Login successful!",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    }
  );
});


app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0)
      return res.status(404).json({ error: "User not found." });

    res.json({ message: "User deleted successfully!" });
  });
});



app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  db.run(
    `UPDATE users SET username = ?, email = ? WHERE id = ?`,
    [username, email, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      if (this.changes === 0)
        return res.status(404).json({ error: "User not found." });

      res.json({ message: "User updated successfully!" });
    }
  );
});




// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
