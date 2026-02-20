'use client';
import {
  useInboxData,
  useDeleteInboxData,
  useDeleteInbox,
  parseInboxDataField,
  type InboxData,
} from '@/backendProvider';
import DisplayCard from '@/Components/DisplayCards';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal, { openModal } from '@/Components/Modal';
import Spinner from '@/Components/Spinner';
import Swal from 'sweetalert2';
import { toast } from 'sonner';

export default function Inbox({ id }: { id: string }) {
  const navigate = useRouter();
  const [modalData, setModalData] = useState<InboxData | null>(null);
  const { data, isLoading: loading, refetch } = useInboxData(id);

  // Refetch data when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  const displayData = Array.isArray(data) ? data : data ? [data] : [];

  const deleteInboxDataMutation = useDeleteInboxData();
  const deleteInboxMutation = useDeleteInbox();

  const handleDelete = (itemId: string) => async () => {
    // Close the modal if open
    const modal = document.getElementById(
      'inbox-data-modal',
    ) as HTMLDialogElement;
    if (modal) modal.close();

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteInboxDataMutation.mutateAsync(itemId);
          toast.success('The message has been deleted.');
          refetch();
        } catch (error) {
          console.error('Error deleting message:', error);
          toast.error('Failed to delete message.');
        }
      }
    });
  };

  const handleDeleteInbox = async () => {
    Swal.fire({
      title: 'Delete this Inbox?',
      text: "You won't be able to revert this! All messages will be lost.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (id) {
            await deleteInboxMutation.mutateAsync(id);
            toast.success('The inbox has been deleted.');
            navigate.push('/dashboard/inboxes');
          }
        } catch (error) {
          console.error('Error deleting inbox:', error);
          toast.error('Failed to delete inbox.');
        }
      }
    });
  };

  return (
    <div className='flex flex-col h-full'>
      <div className=''>
        <div className='flex flex-col gap-5 col-span-1'>
          <DisplayCard className='min-h-screen my-5'>
            <div className='h-full flex flex-col'>
              <div className='pt-5 pb-2 mb-3 border-b-2 border-rose-600 flex items-center justify-between'>
                <h3 className='font-bold ubuntu-font text-2xl'>inbox</h3>
                <button
                  onClick={handleDeleteInbox}
                  className='bg-rose-600 cursor-pointer text-white px-5 py-1 rounded-2xl text-xs hover:bg-rose-700 transition'
                >
                  Delete Inbox
                </button>
              </div>
              <div>
                <div className='relative overflow-x-auto shadow-md sm:rounded-lg border border-border'>
                  <table className='w-full text-sm text-left rtl:text-right text-muted-foreground'>
                    <thead className='text-xs text-white uppercase bg-rose-500'>
                      <tr>
                        <th scope='col' className='px-6 py-3'>
                          Messages
                        </th>
                        <th scope='col' className='px-6 py-3'>
                          <span className='sr-only'>View</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={2} className='py-8'>
                            <Spinner className='mx-auto' />
                          </td>
                        </tr>
                      ) : displayData.length > 0 ? (
                        displayData.map((data: InboxData) => (
                          <tr
                            key={data.id}
                            className='bg-card border-b border-border hover:bg-muted transition-colors'
                          >
                            <th
                              scope='row'
                              className='px-6 py-4 font-medium text-foreground whitespace-nowrap'
                            >
                              {(() => {
                                const parsedData = parseInboxDataField(data);
                                return parsedData.name || 'Unknown';
                              })()}
                            </th>

                            <td className='px-6 py-4 text-right '>
                              <button
                                onClick={() => {
                                  openModal('inbox-data-modal');
                                  setModalData(data);
                                }}
                                className='font-medium text-rose-600 hover:underline'
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className='py-16 text-center'>
                            <div className='flex flex-col items-center gap-4'>
                              <div className='w-20 h-20 bg-muted rounded-full flex items-center justify-center'>
                                <svg
                                  className='w-10 h-10 text-rose-400 dark:text-rose-500'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className='text-foreground font-semibold text-lg mb-1'>
                                  No messages yet
                                </p>
                                <p className='text-muted-foreground text-sm'>
                                  Messages from your forms will appear here
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </DisplayCard>
        </div>
      </div>
      <Modal id='inbox-data-modal'>
        <div className='p-6 bg-card'>
          <h2 className='text-xl font-semibold text-foreground mb-6'>
            Details
          </h2>
          <div className='space-y-4'>
            {(() => {
              const parsedData = modalData
                ? parseInboxDataField(modalData)
                : {};
              return Object.keys(parsedData).map((key) => (
                <div
                  key={key}
                  className='flex border-b border-border pb-3 last:border-b-0'
                >
                  <div className='w-1/3 text-sm font-bold text-rose-500 dark:text-rose-400 capitalize'>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className='w-2/3 text-foreground'>{parsedData[key]}</div>
                </div>
              ));
            })()}
          </div>
          <div className='flex justify-end mt-6'>
            <button
              onClick={
                modalData ? handleDelete(modalData.id.toString()) : undefined
              }
              className='px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded hover:bg-rose-700 transition-colors'
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
