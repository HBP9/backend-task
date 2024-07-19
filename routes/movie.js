const express = require("express");
const router = express.Router();
const validator = require("validator");
const Movies = require("../models/movie");
const logger = require("../utils/logger");
const loggingMiddleware = require("../utils/logginMiddleware");

router.use(loggingMiddleware);

router.post("/addMovie", async (req, res) => {
  const { name, img, summary } = req.body;
  if (!name || !img || !summary) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validator.isURL(img)) {
    return res.status(400).json({ message: "Invalid URL format for img" });
  }
  const movie = new Movies({
    name,
    img,
    summary,
  });
  try {
    const newMovie = await movie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    logger.error(`${req.method} on url ${req.url} error ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

router.get("/getMovie", async (req, res) => {
  const { name } = req.query;
  try {
    const movie = await Movies.findOne({ name });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    logger.error(`${req.method} on url ${req.url} error ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

router.patch("/updateMovie", async (req, res) => {
  const { name, newName, img, summary } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Original movie name is required" });
  }
  if (img && !validator.isURL(img)) {
    return res.status(400).json({ message: "Invalid URL format for img" });
  }
  try {
    const updatedMovie = await Movies.findOneAndUpdate(
      { name },
      { name: newName || name, img, summary },
      { new: true, runValidators: true }
    );
    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(updatedMovie);
  } catch (err) {
    logger.error(`${req.method} on url ${req.url} error ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/deleteMovie", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  try {
    const deletedMovie = await Movies.findOneAndDelete({ name });
    if (!deletedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json({ message: "Movie deleted successfully", movie: deletedMovie });
  } catch (err) {
    logger.error(`${req.method} on url ${req.url} error ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
