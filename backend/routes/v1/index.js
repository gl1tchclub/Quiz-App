/**
 * @file Manages routes related to the root index page
 * @author Elizabeth Minty
 */
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  let x = [
    "Welcome! Here are all the available routes",
    "Home: https://quiz-app-49jp.onrender.com/api/v1/",
    "Get Quizzes (no auth): https://quiz-app-49jp.onrender.com/api/v1/public/all",
    "Get Quiz Average Score (no auth): https://quiz-app-49jp.onrender.com/api/v1/public/:id",
    "Seed basic users (admin only): https://quiz-app-49jp.onrender.com/api/v1/seedBasicUsers",
    "Login: https://quiz-app-49jp.onrender.com/api/v1/auth/login",
    "Register: https://quiz-app-49jp.onrender.com/api/v1/auth/register",
    "Get All Users: https://quiz-app-49jp.onrender.com/api/v1/users/all",
    "Get/Put/Del User by ID: https://quiz-app-49jp.onrender.com/api/v1/users/:uuid",
    "Create Quiz: https://quiz-app-49jp.onrender.com/api/v1/quizzes/create",
    "Get/Del/Put Quiz: https://quiz-app-49jp.onrender.com/api/v1/quizzes/:id",
    "Create Score: https://quiz-app-49jp.onrender.com/api/v1/quizzes/scores",
    "Create Participation: https://quiz-app-49jp.onrender.com/api/v1/quizzes/participation",
    "Get User Answers: https://quiz-app-49jp.onrender.com/api/v1/quizzes/userAnswers",
    "Create User Answers: https://quiz-app-49jp.onrender.com/api/v1/quizzes/createAnswers",

  ]
  res.send(x)
})

export default router;
