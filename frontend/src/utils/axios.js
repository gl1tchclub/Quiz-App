import axios from "axios";

// Create an axios instance
const quizAppInstance = axios.create({
  baseURL: "https://quiz-app-49jp.onrender.com/api/v1", 
  timeout: 100000,
});

export { quizAppInstance };