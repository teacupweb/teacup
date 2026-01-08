import { useAuth } from '@/AuthProvider';
import {
  useCreateInbox,
  useUserInboxes,
  type inboxType,
} from '@/backendProvider';
import DashboardHeader from '@/Components/DashboardHeader';
import DisplayCard from '@/Components/DisplayCards';
import Modal, { openModal } from '@/Components/Modal';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import Spinner from '@/Components/Spinner';
import { useEffect } from 'react';

export default function Inboxes() {
  const { user } = useAuth();
  const company_id = user !== 'userNotFound' && user?.user_metadata.company_id;
  console.log(company_id);
  const { data, isLoading: loading, refetch } = useUserInboxes(company_id);

  // Refetch data when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  const createInboxMutation = useCreateInbox();

  const handleCreateInbox = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    // @ts-ignore
    const name = form.elements.namedItem('name')?.value.trim();

    if (!name) {
      toast.error('Please enter an inbox name!');
      return;
    }

    try {
      const inboxData: inboxType = {
        name: name,
        owner:
          user !== 'userNotFound' && user?.user_metadata.company_id
            ? user.user_metadata.company_id
            : '',
      };

      // Show loading toast
      const toastId = toast.loading('Creating inbox...');

      await createInboxMutation.mutateAsync(inboxData);

      // Success message
      toast.update(toastId, {
        render: 'Inbox created successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });

      // Close the modal
        // Close the modal
        const modal = document.getElementById(
          'create-inbox'
        ) as HTMLDialogElement;
        if (modal) {
          modal.close();
        }

        // Refresh the inbox list - handled by query invalidation
        // refetch();

        // Reset the form
        form.reset();
    } catch (error) {
      console.error('Error creating inbox:', error);
      toast.error('Failed to create inbox. Please try again.');
    }
  };

  return (
    <div className='flex flex-col h-full'>
      <DashboardHeader />
      <div className=''>
        <div className='flex flex-col gap-5 col-span-1'>
          <DisplayCard className='min-h-[500px] my-5'>
            <div className='h-full flex flex-col'>
              <div className='pt-5 pb-2 mb-3 border-b-2 border-rose-600 flex items-center justify-between'>
                <h3 className='font-bold ubuntu-font text-2xl'>Inboxes</h3>
                <button
                  onClick={() => {
                    openModal('create-inbox');
                  }}
                  className='bg-rose-600 cursor-pointer text-white px-5 py-1 rounded-2xl text-xs hover:bg-rose-700 transition'
                >
                  New Inbox
                </button>
              </div>
              <div>
                <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
                  <table className='w-full text-sm text-left rtl:text-right text-muted-foreground'>
                    <thead className='text-xs text-gray-200 uppercase bg-rose-500'>
                      <tr>
                        <th scope='col' className='px-6 py-3'>
                          Inbox Titles
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
                      ) : data.length > 0 ? (
                        data.map((inbox: inboxType) => (
                          <tr
                            key={inbox.id}
                            className='bg-card border-b border-border hover:bg-muted transition-colors'
                          >
                            <th
                              scope='row'
                              className='px-6 py-4 font-medium text-foreground whitespace-nowrap'
                            >
                              {inbox.name}
                            </th>

                            <td className='px-6 py-4 text-right'>
                              <Link
                                to={`/dashboard/inboxes/${inbox.id}`}
                                className='font-medium text-rose-600 hover:underline'
                              >
                                Visit
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className='py-16 text-center'>
                            <div className='flex flex-col items-center gap-4'>
                              <div className='w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center'>
                                <svg
                                  className='w-10 h-10 text-rose-400'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className='text-gray-700 font-semibold text-lg mb-1'>
                                  No inboxes yet
                                </p>
                                <p className='text-gray-500 text-sm'>
                                  Create your first inbox to start receiving
                                  messages
                                </p>
                              </div>
                              <button
                                onClick={() => openModal('create-inbox')}
                                className='mt-2 bg-rose-600 text-white px-6 py-2 rounded-xl hover:bg-rose-700 transition font-medium'
                              >
                                Create Inbox
                              </button>
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
      <Modal id='create-inbox'>
        <div className='flex flex-col p-8'>
          <h2 className='text-2xl font-bold mb-4'>Create a New Inbox</h2>
          <form onSubmit={handleCreateInbox} className='flex flex-col'>
            <input
              type='text'
              name='name'
              placeholder='Enter inbox name'
              className='mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500'
              required
            />
            <button
              type='submit'
              className='mt-4 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500'
            >
              Create
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
