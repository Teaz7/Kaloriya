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



app.get("/nutrition", (req, res) => {
    const query = req.query.food;

    request.get({
        url: "https://api.calorieninjas.com/v1/nutrition?query=" + query,
        headers: { "X-Api-Key": "dGVzPeFLQoCdbcEC1wKE8A==bfiTzccHJBpbHTKi" }
    }, (error, response, body) => {
        if (error) return res.status(500).json({ error });
        if (response.statusCode !== 200) return res.status(400).send(body);
        res.send(body);
    });
});




const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
