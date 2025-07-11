const express = require("express");
const app = express();
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));
app.listen(4173, "0.0.0.0", () => console.log("Health check running on port 4173"));