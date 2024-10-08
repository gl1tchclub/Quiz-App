import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../main";
import { Button } from "@/components/ui/button";

const DeleteButton = ({ item }) => {
  const { mutate: deleteItemMutation, data: updatedData } = useMutation(
    async () => {
      (item) =>
        fetch(
          `https://quiz-app-49jp.onrender.com/${item.type}/${item.id}`,
          {
            method: DELETE,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(`${item.type}`)
        }
    }
  );

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        deleteItemMutation(`/users/${id}`);
        setData(data.filter((item) => item.id !== id)); // Remove the item from the data array
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Button color="danger" onClick={() => handleDelete(item.id)}>
      Delete
    </Button>
  );
};
export default DeleteButton;
