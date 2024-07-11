const express = require("express");
const router = express.Router();

router.use("/test", require("./movie.js"));

module.exports = router;
