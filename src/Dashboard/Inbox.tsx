import { useAuth } from "@/AuthProvider";
import { userInboxData } from "@/backendProvider";
import DashboardHeader from "@/Components/DashboardHeader";
import DisplayCard from "@/Components/DisplayCards";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Modal, { openModal } from "@/Components/Modal";

export default function Inbox() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [modalData, setModalData] = useState(null);
  const { user } = useAuth();
  // console.log(id);
  useEffect(() => {
    if (user === "userNotFound" || !user?.email) {
      setData([]);
      return;
    }
    userInboxData(String(id)).then((data) => {
      if (!data) {
        setData([]);
      } else {
        setData(data);
      }
    });
  }, [id]);
  // console.log(data);
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />
      <div className="">
        {/* {Array.from({ length: 4 }).map((_, index) => (
          <DisplayCard className='col-span-1' key={index} />
        ))} */}
        {/* <DisplayCard className='col-span-3 '>
          <div>

            <div>
              <BlogForm />
            </div>
          </div>
        </DisplayCard> */}
        <div className="flex flex-col gap-5 col-span-1">
          <DisplayCard className="min-h-screen my-5">
            <div className="h-full flex flex-col">
              <div className="pt-5 pb-2 mb-3 border-b-2 border-rose-600 flex items-center justify-between">
                <h3 className="font-bold ubuntu-font text-2xl">inbox</h3>
                {/* <Link to='/dashboard/Blogs/new'> */}
                <button className="bg-rose-600 cursor-pointer text-white px-5 py-1 rounded-2xl text-xs hover:bg-rose-700 transition">
                  Inbox
                </button>
                {/* </Link> */}
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
                      {data.map((data) => (
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
                                setModalData(data?.data);
                              }}
                              className="font-medium text-rose-600 hover:underline"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </DisplayCard>
          {/* <DisplayCard className='col-span-2' /> */}
          {/* <DisplayCard className='col-span-2' /> */}
        </div>
      </div>
      <Modal id="inbox-data-modal">
        <div className="p-6 bg-white">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Details</h2>
          <div className="space-y-4">
            {modalData &&
              Object.keys(modalData).map((key) => (
                <div
                  key={key}
                  className="flex border-b border-rose-100 pb-3 last:border-b-0"
                >
                  <div className="w-1/3 text-sm font-bold text-rose-500 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div className="w-2/3 text-gray-900">{modalData[key]}</div>
                </div>
              ))}
          </div>
          <div className="flex justify-end mt-6">
            <button
              // onClick={() => closeModal("inbox-data-modal")}
              className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded hover:bg-rose-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
