/**
 * @file UsersTable.jsx
 * @module UsersTable
 * @description Component to display a table of users, handle user actions like deletion and updating, and fetch user data using react-query.
 * @author Elizabeth Minty
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../../main";
import { useMutation } from "@tanstack/react-query";

// Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";

import CardWrapper from "../CardWrapper";
import Loading from "../Load";
import UpdateDialog from "../UpdateDialog";
import { ErrorAlert } from "../Alert";

/**
 * Component for displaying all users in a table.
 * @returns {JSX.Element} UsersTable component JSX
 */
const UsersTable = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userData"));

  // If user is not logged in, display unauthorized alert
  if (!user) {
    return <ErrorAlert desc="Unauthorized. Please log in" />;
  }

  // State for dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  try {
    // Get all users
    const {
      isLoading,
      data: users,
      error,
      refetch,
    } = useQuery({
      queryKey: ["users"],
      queryFn: () =>
        fetch("https://quiz-app-49jp.onrender.com/api/v1/users/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => res.json()),
    });

    // Mutation to delete a user
    const { mutate: deleteUserMutation, data: updatedData } = useMutation({
      mutationFn: async ({ id }) => {
        const response = await fetch(
          `https://quiz-app-49jp.onrender.com/api/v1/users/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries("users");
        refetch();
      },
      onError: (error) => {
        console.error("Delete mutation error:", error);
      },
    });

    // Function to handle deletion of a user
    const handleDelete = (id) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?",
      );
      if (confirmDelete) {
        try {
          deleteUserMutation({ id });
        } catch (err) {
          console.log(err);
        }
      }
    };

    // Toggle dialog
    const toggleDialog = () => {
      setIsDialogOpen(!isDialogOpen);
    };

    // Function to update user details
    const updateUser = async (updatedUser) => {
      try {
        // Perform update operation (e.g., API call)
        const response = await fetch(
          `https://quiz-app-49jp.onrender.com/api/v1/users/${updatedUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedUser),
          },
        );
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        // const data = await response.json();
        // Invalidate and refetch users list
        setIsDialogOpen(false);
        queryClient.invalidateQueries("users");
        refetch();
      } catch (error) {
        console.error("Update user error:", error);
      }
    };

    return (
      <>
        {isLoading ? (
          <div className="justify-center flex">
            <Loading />
          </div>
        ) : (
          <CardWrapper
            title="All Users"
            box="w-fit mx-auto bg-pink-300 shadow-lg rounded-lg p-6 my-20"
            label="Information for all user accounts"
          >
            <section className="text-pink-700 bg-pink-200 rounded-lg p-6 shadow-md">
              <Table className="hover:none">
                <TableHeader className="text-lg text-pink-700 ">
                  <TableRow className="border-b-2 border-pink-300 hover:bg-transparent">
                    <TableHead className="text-inherit py-2 px-4">ID</TableHead>
                    <TableHead className="text-inherit py-2 px-4">
                      Email
                    </TableHead>
                    <TableHead className="text-inherit py-2 px-4">
                      Username
                    </TableHead>
                    <TableHead className="text-inherit py-2 px-4">
                      First Name
                    </TableHead>
                    <TableHead className="text-inherit py-2 px-4">
                      Last Name
                    </TableHead>
                    <TableHead className="text-inherit py-2 px-4">
                      Role
                    </TableHead>
                    <TableHead className="text-inherit py-2 px-4">
                      Options
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-gray-700 font-semibold">
                  {users.error ? (
                    <TableRow>
                      <TableCell colSpan="3">No Users!</TableCell>
                    </TableRow>
                  ) : (
                    users.data.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.firstName}</TableCell>
                        <TableCell>{user.lastName}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          {user.role === "ADMIN_USER" ? null : (
                            <>
                              <UpdateDialog
                                user={user}
                                onUpdate={updateUser}
                                submitted={isDialogOpen}
                                onClose={toggleDialog}
                              />
                              <Button
                                className="bg-pink-500 hover:bg-pink-400"
                                onClick={() => handleDelete(user.id)}
                              >
                                <TrashIcon className="h-5 w-5 mr-2" />
                                Delete
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </section>
          </CardWrapper>
        )}
      </>
    );
  } catch (error) {
    localStorage.setItem("error", "true");
    console.log(error);
  }
};
export default UsersTable;
