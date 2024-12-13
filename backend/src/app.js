const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/database");
const apiRoutes = require("./routes/api");
const seedDatabase = require("./config/seedData");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL database");

    await sequelize.sync({ force: process.env.NODE_ENV === "test" });
    console.log("Database synchronized");

    if (process.env.NODE_ENV !== "test") {
      const { Question } = require("./models/Quiz");
      const existingQuestions = await Question.count();

      if (existingQuestions === 0) {
        await seedDatabase();
        console.log("Database seeded with initial data");
      }
    }

    if (process.env.NODE_ENV !== "test") {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

module.exports = { app, startServer };
