const express = require("express");
const router = express.Router();
const { auth } = require("../common/auth");
const { bodyValidator } = require("../common/http");

const Question = require("../model/Question");
const Quiz = require("../model/Quiz");

//sve ove rute ce dobit auth kasnije
//get quiz by id
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.getQuizByIdPopulated(req.params.id);
    res.status(200).json(quiz);
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: "Could not load item" });
  }
});

//add question to quiz
router.post("/:id/question", async (req, res) => {
  try {
    if (
      !bodyValidator(Object.keys(req.body), ["text", "points", "scoringSystem"])
    ) {
      return res.status(400).json({ message: "Invalid body" });
    }
    const quiz = Quiz.getQuizByIdPopulated(req.params.id);

    //provjeriti da li je ovaj user owner ovog kviza

    const question = new Question(req.body);
    question.save();
    quiz.questions.push(question);
    quiz.save();
    res.status(201).json(quiz); //da li vratiti cijeli kviz ovdje
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: "Could not load item" });
  }
});

module.exports = router;
