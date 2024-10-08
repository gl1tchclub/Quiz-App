/**
 * @file AllQuizzesTable.jsx
 * @module AllQuizzesTable
 * @description Component to display a table of quizzes, handle quiz actions like deletion, and fetch quiz data using react-query.
 * @author Elizabeth Minty
 */

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../../main";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router";

// Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";

import CardWrapper from "../CardWrapper";
import Loading from "../Load";
import { Link } from "react-router-dom";

/**
 * Component for displaying all quizzes in a table.
 * @returns {JSX.Element} AllQuizzesTable component JSX
 */
const AllQuizzesTable = () => {
  const baseURL = "https://quiz-app-49jp.onrender.com/api/v1/";
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let user;
  let isAdmin;

  if (token) {
    user = JSON.parse(localStorage.getItem("userData"));
    isAdmin = user.role === "ADMIN_USER";
  }

  // const [type, setType] = useState(null); // for old, active, future quizzes (need to implement)
  const [averageScores, setAverageScores] = useState({});

    // Get All Quizzes
    const {
      isLoading,
      data: quizzes,
      refetch,
    } = useQuery({
      queryKey: ["quizzes"],
      queryFn: () => fetch(`${baseURL}public/all`).then((res) => res.json()),
      onSuccess: () => {
        localStorage.removeItem("quizId");
      },
    });

    // Mutation to delete a quiz
    const { mutate: deleteQuizMutation, data: updatedData } = useMutation({
      mutationFn: async ({ id }) => {
        const response = await fetch(`${baseURL}quizzes/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to delete quiz");
        }
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries("quizzes");
        refetch();
      },
      onError: (error) => {
        console.error("Delete mutation error:", error);
      },
    });

    // Function to handle deletion of a quiz
    const handleDelete = (id) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this quiz?",
      );
      if (confirmDelete) {
        try {
          deleteQuizMutation({ id });
        } catch (err) {
          console.log(err);
        }
      }
    };

    //create fn to update quiz data when new quiz created using queryClient.invalidateQueries("quizzes") and refetch();
    // Fetch average scores for quizzes on component mount or when quizzes data changes
    useEffect(() => {
      const getAverageScores = async () => {
        const scores = {};

        // Iterate over quizzes and fetch average score for each quiz
        for (const quiz of quizzes.data) {
          try {
            const response = await fetch(`${baseURL}public/${quiz.id}`);
            if (!response.ok) {
              throw new Error("Network error");
            }
            const data = await response.json();
            scores[quiz.id] = data.data;
          } catch (error) {
            console.error(
              "Failed to fetch average score for quiz:",
              quiz.id,
              error,
            );
            scores[quiz.id] = "error";
          }
        }

        setAverageScores(scores);
      };

      if (quizzes) {
        getAverageScores();
      }
    }, [quizzes]);

    return (
      <>
        {isLoading ? (
          <div className="justify-center flex">
            <Loading />
          </div>
        ) : (
          <>
            <CardWrapper
              title="All Quizzes"
              box="w-fit mx-auto bg-pink-300 shadow-lg rounded-lg p-6 my-20"
              label="All quiz information"
            >
              <section className="text-pink-700 bg-pink-200 rounded-lg p-6 shadow-md">
                <Table className="hover:none w-full text-pink-700">
                  <TableHeader>
                    <TableRow className="border-b-2 border-pink-300 hover:bg-transparent text-xl">
                      <TableHead className="text-inherit py-2 px-4">
                        Name
                      </TableHead>
                      <TableHead className="text-inherit py-2 px-4">
                        Type
                      </TableHead>
                      <TableHead className="text-inherit py-2 px-4">
                        Difficulty
                      </TableHead>
                      <TableHead className="text-inherit py-2 px-4">
                        Start Date
                      </TableHead>
                      <TableHead className="text-inherit py-2 px-4">
                        End Date
                      </TableHead>
                      <TableHead className="text-inherit py-2 px-4">
                        All Scores
                      </TableHead>
                      <TableHead className="text-inherit py-2 px-4">
                        Average Score
                      </TableHead>
                      <TableHead className="text-inherit py-2 px-4">
                        Options
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-gray-700 font-semibold">
                    {quizzes.error ? (
                      <TableRow>
                        <TableCell colSpan="7" className="text-lg">No Quizzes Available</TableCell>
                      </TableRow>
                    ) : (
                      quizzes.data.map((quiz) => (
                        <React.Fragment key={quiz.id}>
                          <TableRow className="text-lg">
                            <TableCell>{quiz.name}</TableCell>
                            <TableCell>{quiz.type}</TableCell>
                            <TableCell>{quiz.difficulty}</TableCell>
                            <TableCell>{quiz.startDate}</TableCell>
                            <TableCell>{quiz.endDate}</TableCell>
                            <TableCell>
                              {quiz.userQuizScores &&
                              quiz.userQuizScores.length > 0
                                ? quiz.userQuizScores.map((score, idx) => (
                                    <p key={idx}>{score}</p>
                                  ))
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {averageScores[quiz.id] !== undefined
                                ? averageScores[quiz.id]
                                : "Calculating..."}
                            </TableCell>
                            <TableCell>
                              {!user ? (
                                <Link to="/login">Login to play</Link>
                              ) : (
                                <>
                                  {isAdmin ? (
                                    <>
                                      <Button
                                        className="bg-pink-500 hover:bg-pink-400 flex mb-2"
                                        onClick={() => handleDelete(quiz.id)}
                                      >
                                        <TrashIcon className="h-5 w-5 mr-2" />
                                        Delete
                                      </Button>
                                      <Button
                                        className="bg-pink-500 hover:bg-pink-400"
                                        onClick={() => {
                                          localStorage.setItem(
                                            "quizId",
                                            quiz.id,
                                          );
                                          navigate("/quiz");
                                        }}
                                      >
                                        Play
                                      </Button>
                                    </>
                                  ) : (
                                    <Button
                                      className="bg-pink-500 hover:bg-pink-400"
                                      onClick={() => {
                                        localStorage.setItem("quizId", quiz.id);
                                        navigate("/quiz");
                                      }}
                                    >
                                      Play
                                    </Button>
                                  )}
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                          >
                            <AccordionItem value="questions">
                              <AccordionTrigger className="text-pink-500 text-sm">
                                View Questions
                              </AccordionTrigger>
                              <AccordionContent>
                                {quiz.questions.map((question, index) => (
                                  <TableRow key={`${quiz.id}-${index}`}>
                                    <TableCell colSpan="5" className="pl-8">
                                      <strong>{question.question}</strong>
                                    </TableCell>
                                    <TableCell colSpan="2">
                                      <ul className="ml-4">
                                        {question.incorrectAnswers.map(
                                          (answer, idx) => (
                                            <li
                                              key={`${quiz.id}-${index}-${idx}`}
                                            >
                                              {answer}
                                            </li>
                                          ),
                                        )}
                                        <li>{question.correctAnswer}</li>
                                      </ul>
                                    </TableCell>
                                    <TableCell></TableCell>{" "}
                                    {/* Empty cell for layout */}
                                  </TableRow>
                                ))}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </React.Fragment>
                      ))
                    )}
                  </TableBody>
                </Table>
              </section>
            </CardWrapper>
          </>
        )}
      </>
    );
};

export default AllQuizzesTable;
