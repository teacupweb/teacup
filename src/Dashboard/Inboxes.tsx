import { useAuth } from "@/AuthProvider";
import {
  createUserInbox,
  getUserInboxes,
  type inboxType,
} from "@/backendProvider";
import DashboardHeader from "@/Components/DashboardHeader";
import DisplayCard from "@/Components/DisplayCards";
import Modal, { openModal } from "@/Components/Modal";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";

export default function Inboxes() {
  const { user } = useAuth();
  const [data, setData] = useState<inboxType[]>([]);

  useEffect(() => {
    if (user === "userNotFound" || !user?.email) {
      setData([]);
      return;
    }
    getUserInboxes(user.email).then((data) => {
      if (!data) {
        setData([]);
      } else {
        setData(data as inboxType[]);
      }
    });
  }, [user]);

  const handleCreateInbox = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const name = form.name.value.trim();

    if (!name) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter an inbox name!",
        confirmButtonColor: "#e11d48",
      });
      return;
    }

    try {
      const inboxData: inboxType = {
        name: name,
        created_by: user?.email,
      };

      // Show loading state
      Swal.fire({
        title: "Creating Inbox...",
        text: "Please wait while we create your inbox",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await createUserInbox(inboxData);

      // Success message
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Inbox created successfully!",
        confirmButtonColor: "#e11d48",
      }).then(() => {
        // Close the modal
        const modal = document.getElementById(
          "create-inbox",
        ) as HTMLDialogElement;
        if (modal) {
          modal.close();
        }

        // Refresh the inbox list
        if (user?.email) {
          getUserInboxes(user.email).then((data) => {
            if (!data) {
              setData([]);
            } else {
              setData(data as inboxType[]);
            }
          });
        }

        // Reset the form
        form.reset();
      });
    } catch (error) {
      console.error("Error creating inbox:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create inbox. Please try again.",
        confirmButtonColor: "#e11d48",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />
      <div className="">
        <div className="flex flex-col gap-5 col-span-1">
          <DisplayCard className="min-h-screen my-5">
            <div className="h-full flex flex-col">
              <div className="pt-5 pb-2 mb-3 border-b-2 border-rose-600 flex items-center justify-between">
                <h3 className="font-bold ubuntu-font text-2xl">Inboxes</h3>
                <button
                  onClick={() => {
                    openModal("create-inbox");
                  }}
                  className="bg-rose-600 cursor-pointer text-white px-5 py-1 rounded-2xl text-xs hover:bg-rose-700 transition"
                >
                  New Inbox
                </button>
              </div>
              <div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-xs text-gray-200 uppercase bg-rose-500">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Inbox Titles
                        </th>
                        <th scope="col" className="px-6 py-3">
                          <span className="sr-only">View</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((inbox) => (
                        <tr
                          key={inbox.id}
                          className="bg-white border-b border-gray-200 hover:bg-gray-50 "
                        >
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {inbox.name}
                          </th>

                          <td className="px-6 py-4 text-right">
                            <Link
                              to={`/dashboard/inboxes/${inbox.id}`}
                              className="font-medium text-rose-600 hover:underline"
                            >
                              Visit
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </DisplayCard>
        </div>
      </div>
      <Modal id="create-inbox">
        <div className="flex flex-col p-8">
          <h2 className="text-2xl font-bold mb-4">Create a New Inbox</h2>
          <form onSubmit={handleCreateInbox} className="flex flex-col">
            <input
              type="text"
              name="name"
              placeholder="Enter inbox name"
              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              Create
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
