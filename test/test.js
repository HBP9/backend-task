const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const app = require("../index");
const Movies = require("../models/movie");

jest.mock("../models/movie");

beforeAll(async () => {
  await mongoose.connect(
    "mongodb+srv://Yash_test:test123@test-api.x7wjt0c.mongodb.net/interview",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /test/addMovie", () => {
  it("should add a new movie", async () => {
    const newMovie = {
      name: "Some Movie",
      img: "https://www.pexels.com/photo/green-and-blue-peacock-feather-674010/",
      summary: "Some kind of summary here",
    };

    Movies.prototype.save.mockResolvedValue(newMovie);

    const res = await request(app).post("/test/addMovie").send(newMovie);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("name", newMovie.name);
    expect(res.body).toHaveProperty("img", newMovie.img);
    expect(res.body).toHaveProperty("summary", newMovie.summary);
  });

  it("should return 400 if required fields are missing", async () => {
    const invalidMovie = {
      img: "https://www.pexels.com/photo/green-and-blue-peacock-feather-674010/",
      summary: "Some kind of summary here",
    };

    const res = await request(app).post("/test/addMovie").send(invalidMovie);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "All fields are required");
  });

  it("should return 400 if img URL format is invalid", async () => {
    const invalidMovie = {
      name: "Some Movie",
      img: "invalid-url",
      summary: "Some kind of summary here",
    };

    const res = await request(app).post("/test/addMovie").send(invalidMovie);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid URL format for img");
  });
});

describe("GET /test/getMovie", () => {
  it("should get a movie by name", async () => {
    const movie = {
      name: "Some Movie",
      img: "https://www.pexels.com/photo/green-and-blue-peacock-feather-674010/",
      summary: "Some kind of summary here",
    };

    Movies.findOne.mockResolvedValue(movie);

    const res = await request(app)
      .get("/test/getMovie")
      .query({ name: movie.name });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("name", movie.name);
    expect(res.body).toHaveProperty("img", movie.img);
    expect(res.body).toHaveProperty("summary", movie.summary);
  });

  it("should return 404 if movie is not found", async () => {
    Movies.findOne.mockResolvedValue(null);
    const res = await request(app)
      .get("/test/getMovie")
      .query({ name: "Other Movie" });

    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty("message", "Movie not found");
  });
});

describe("PATCH /test/updateMovie", () => {
  it("should update a movie", async () => {
    const updatedMovie = {
      name: "Some Updated Movie",
      img: "https://www.pexels.com/photo/green-and-blue-peacock-feather-674010",
      summary: "Some kind of updated summary here",
    };

    Movies.findOneAndUpdate.mockResolvedValue(updatedMovie);

    const res = await request(app)
      .patch("/test/updateMovie")
      .send(updatedMovie);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("name", updatedMovie.name);
    expect(res.body).toHaveProperty("img", updatedMovie.img);
    expect(res.body).toHaveProperty("summary", updatedMovie.summary);
  });

  it("should return 400 if original movie name is missing", async () => {
    const res = await request(app).patch("/test/updateMovie").send({
      newName: "Some Movie",
      img: "https://www.pexels.com/photo/green-and-blue-peacock-feather-674010",
      summary: "Some kind of updated summary here",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "message",
      "Original movie name is required"
    );
  });

  it("should return 400 if img URL format is invalid", async () => {
    const res = await request(app).patch("/test/updateMovie").send({
      name: "Inception",
      img: "invalid-url",
      summary: "Some kind of updated summary here",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid URL format for img");
  });

  it("should return 404 if movie to update is not found", async () => {
    Movies.findOneAndUpdate.mockResolvedValue(null);

    const res = await request(app).patch("/test/updateMovie").send({
      name: "Other Movie",
      newName: "New Name",
      img: "https://www.pexels.com/photo/green-and-blue-peacock-feather-674010",
      summary: "Some kind of updated summary here",
    });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message", "Movie not found");
  });
});

describe("DELETE /test/deleteMovie", () => {
  it("should delete a movie", async () => {
    const deletedMovie = {
      name: "Some Movie",
      img: "https://www.pexels.com/photo/green-and-blue-peacock-feather-674010/",
      summary: "Some kind of summary here",
    };

    Movies.findOneAndDelete.mockResolvedValue(deletedMovie);

    const res = await request(app)
      .delete("/test/deleteMovie")
      .send({ name: deletedMovie.name });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Movie deleted successfully");
    expect(res.body.movie).toHaveProperty("name", deletedMovie.name);
  });

  it("should return 400 if movie name is missing in delete request", async () => {
    const res = await request(app).delete("/test/deleteMovie").send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Name is required");
  });

  it("should return 404 if movie to delete is not found", async () => {
    Movies.findOneAndDelete.mockResolvedValue(null);

    const res = await request(app)
      .delete("/test/deleteMovie")
      .send({ name: "Other Movie" });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message", "Movie not found");
  });
});
