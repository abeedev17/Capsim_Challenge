const request = require("supertest");
const { app, startServer } = require("../app");
const sequelize = require("../config/database");
const seedDatabase = require("../config/seedData");

describe("Quiz API Tests", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";

    await startServer();

    await seedDatabase();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("GET /api/questions", () => {
    it("should return all questions", async () => {
      const response = await request(app)
        .get("/api/questions")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);

      const question = response.body[0];
      expect(question).toHaveProperty("text");
      expect(question).toHaveProperty("type");
      expect(question).toHaveProperty("Answers");
      expect(question.Answers).toBeInstanceOf(Array);
    });
  });

  describe("POST /api/scores", () => {
    it("should save a new score", async () => {
      const score = 85;

      const response = await request(app)
        .post("/api/scores")
        .send({ score })
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.score).toBe(score);
    });

    it("should validate score input", async () => {
      const invalidScore = -1;

      await request(app)
        .post("/api/scores")
        .send({ score: invalidScore })
        .expect(400);
    });

    it("should validate score is a number", async () => {
      await request(app)
        .post("/api/scores")
        .send({ score: "not a number" })
        .expect(400);
    });
  });

  describe("GET /api/scores/distribution", () => {
    beforeEach(async () => {
      const testScores = [95, 85, 75, 65, 55, 45, 35, 25, 15, 5];
      for (const score of testScores) {
        await request(app).post("/api/scores").send({ score });
      }
    });

    it("should return score distribution", async () => {
      const response = await request(app)
        .get("/api/scores/distribution")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(10);
      response.body.forEach((count) => {
        expect(Number.isInteger(count)).toBe(true);
        expect(count).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid routes", async () => {
      await request(app).get("/api/invalid-route").expect(404);
    });
  });
});
