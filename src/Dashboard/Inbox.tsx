import { useInboxData, deleteUserInboxData } from "@/backendProvider";
import DashboardHeader from "@/Components/DashboardHeader";
import DisplayCard from "@/Components/DisplayCards";
import { useState } from "react";
import { useParams } from "react-router";
import Modal, { openModal } from "@/Components/Modal";
import Spinner from "@/Components/Spinner";
import Swal from "sweetalert2";

export default function Inbox() {
  const { id } = useParams();
  const [modalData, setModalData] = useState<any>(null);
  const { inboxData: data, loading, refetch } = useInboxData(id);
  
  // Ensure data is an array for mapping, or handle if it's a single object
  // Based on previous code: setData(data) -> map(data => ...)
  // It seems data is expected to be an array.
  const displayData = Array.isArray(data) ? data : (data ? [data] : []);

  const handleDelete = (itemId: string) => async () => {
    // Close the modal if open
    const modal = document.getElementById("inbox-data-modal") as HTMLDialogElement;
    if (modal) modal.close();

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUserInboxData(itemId);
          await refetch();
          Swal.fire(
            'Deleted!',
            'The message has been deleted.',
            'success'
          );
        } catch (error) {
          console.error("Error deleting message:", error);
          Swal.fire(
            'Error!',
            'Failed to delete message.',
            'error'
          );
        }
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />
      <div className="">
        <div className="flex flex-col gap-5 col-span-1">
          <DisplayCard className="min-h-screen my-5">
            <div className="h-full flex flex-col">
              <div className="pt-5 pb-2 mb-3 border-b-2 border-rose-600 flex items-center justify-between">
                <h3 className="font-bold ubuntu-font text-2xl">inbox</h3>
                <button className="bg-rose-600 cursor-pointer text-white px-5 py-1 rounded-2xl text-xs hover:bg-rose-700 transition">
                  Delete
                </button>
              </div>
              <div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-xs text-gray-200 uppercase bg-rose-500">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Messages
                        </th>
                        <th scope="col" className="px-6 py-3">
                          <span className="sr-only">View</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={2} className="py-8">
                            <Spinner className="mx-auto" />
                          </td>
                        </tr>
                      ) : (
                        displayData.map((data: any) => (
                          <tr
                            key={data.id}
                            className="bg-white border-b border-gray-200 hover:bg-gray-50 "
                          >
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                            >
                              {data.data.name || data.title || "Unknown"}
                            </th>

                            <td className="px-6 py-4 text-right ">
                              <button
                                onClick={() => {
                                  openModal("inbox-data-modal");
                                  setModalData(data);
                                }}
                                className="font-medium text-rose-600 hover:underline"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </DisplayCard>
        </div>
      </div>
      <Modal id="inbox-data-modal">
        <div className="p-6 bg-white">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Details</h2>
          <div className="space-y-4">
            {modalData?.data &&
              Object.keys(modalData.data).map((key) => (
                <div
                  key={key}
                  className="flex border-b border-rose-100 pb-3 last:border-b-0"
                >
                  <div className="w-1/3 text-sm font-bold text-rose-500 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div className="w-2/3 text-gray-900">{modalData.data[key]}</div>
                </div>
              ))}
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={modalData ? handleDelete(modalData.id) : undefined}
              className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded hover:bg-rose-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
