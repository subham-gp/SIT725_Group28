const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// default route for login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});