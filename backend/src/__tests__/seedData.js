const { Question, Answer } = require("../models/Quiz");

const seedDatabase = async () => {
  try {
    const q1 = await Question.create({
      text: "What's the first thing you should do when you need motivation?",
      type: "Single",
    });
    await Answer.bulkCreate([
      { text: "Read a book", points: 5, QuestionId: q1.id },
      { text: "Watch social media", points: 0, QuestionId: q1.id },
      { text: "Go to the gym", points: 3, QuestionId: q1.id },
      { text: "Run in the park", points: 7, QuestionId: q1.id },
    ]);

    const q2 = await Question.create({
      text: "When was Capsim Founded?",
      type: "Single",
    });
    await Answer.bulkCreate([
      { text: "August 2010", points: 0, QuestionId: q2.id },
      { text: "April 1990", points: 0, QuestionId: q2.id },
      { text: "December 2000", points: 0, QuestionId: q2.id },
      { text: "January 1985", points: 1, QuestionId: q2.id },
    ]);

    const q3 = await Question.create({
      text: "Which of the following are Capsim products?",
      type: "Multiple",
    });
    await Answer.bulkCreate([
      { text: "CapsimInbox", points: 1, QuestionId: q3.id },
      { text: "ModXM", points: 1, QuestionId: q3.id },
      { text: "CapsimOutbox", points: 0, QuestionId: q3.id },
      { text: "CompXM", points: 1, QuestionId: q3.id },
    ]);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};

module.exports = seedDatabase;
