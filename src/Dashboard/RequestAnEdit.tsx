import { useState, useEffect } from 'react';
import { FiPlus, FiEye, FiEdit3, FiCalendar, FiRotateCcw } from 'react-icons/fi';
import DisplayCard from '@/Components/DisplayCards';
import Modal, { openModal } from '@/Components/Modal';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/AuthProvider';
import { useUserEditRequests, useCreateEditRequest, useDeleteEditRequest, type EditRequest } from '@/backendProvider';


export default function RequestAnEdit() {
  const { user } = useAuth();
  const companyId = user?.companyId;
  const { data: requests, isLoading, error, refetch } = useUserEditRequests(companyId);
  const { mutateAsync: createEditRequest, isLoading: isSubmitting } = useCreateEditRequest();
  const { mutateAsync: deleteEditRequest } = useDeleteEditRequest();
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second to check undo availability
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const canUndo = (createdAt: Date) => {
    return Date.now() - new Date(createdAt).getTime() < 20000; // 20 seconds
  };

  const handleUndoRequest = async (requestId: string) => {
    try {
      await deleteEditRequest(requestId);
      toast.success('Request undone successfully!');
      refetch();
    } catch (error) {
      toast.error('Failed to undo request. It may be too late to undo.');
    }
  };

  const handleCreateRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const titleInput = form.elements.namedItem('title') as HTMLInputElement;
    const descriptionInput = form.elements.namedItem('description') as HTMLTextAreaElement;
    const title = titleInput?.value.trim();
    const description = descriptionInput?.value.trim();

    if (!title || !description) {
      toast.error('Please fill in all fields!');
      return;
    }

    if (!companyId) {
      toast.error('Company information not available!');
      return;
    }
    
    try {
      const newRequest = {
        title,
        description,
        date: new Date(),
        status: 'pending' as const,
        createdAt: new Date(),
        userId: user.id,
        companyId,
      };

      await createEditRequest(newRequest);
      toast.success('Request submitted successfully! You can undo within 20 seconds.', {
        duration: 3000
      });
      
      // Close modal and reset form
      const modal = document.getElementById('add-request') as HTMLDialogElement;
      if (modal) modal.close();
      form.reset();
      refetch();
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    }
  };

  const handleViewRequest = (request: EditRequest) => {
    // For now, just show the request details in a toast
    // In a real app, this would open a detailed view or modal
    toast.info(`Viewing: ${request.title}`, {
      description: request.description,
      duration: 5000
    });
  };

  return (
    <div className='flex flex-col h-full mx-4 md:mx-8'>
      <div className='flex flex-col gap-5 col-span-1'>
        <DisplayCard className='min-h-[500px] my-5'>
          <div className='h-full flex flex-col'>
            {/* Header */}
            <div className='pt-5 pb-2 mb-3 border-b-2 border-rose-600 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-rose-100 rounded-lg'>
                  <FiEdit3 className='w-5 h-5 text-rose-600' />
                </div>
                <div>
                  <h3 className='font-bold ubuntu-font text-2xl'>
                    Edit Requests
                  </h3>
                  <p className='text-sm text-gray-600 mt-0.5'>
                    Manage your website edit requests
                  </p>
                </div>
              </div>
              <button
                onClick={() => openModal('add-request')}
                className='bg-rose-600 cursor-pointer text-white px-5 py-2 rounded-2xl text-sm hover:bg-rose-700 transition flex items-center gap-2'
              >
                <FiPlus className='w-4 h-4' />
                Add a Request
              </button>
            </div>

            {/* Table */}
            <div className='flex-1 overflow-hidden'>
              <div className='relative overflow-x-auto h-full'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[200px]'>Date</TableHead>
                      <TableHead>Request Title</TableHead>
                      <TableHead className='w-[120px] text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={3} className='py-8'>
                          <div className='space-y-2'>
                            {[...Array(5)].map((_, index) => (
                              <div key={index} className='flex items-center space-x-4 py-2'>
                                <Skeleton className='h-4 w-24' />
                                <Skeleton className='h-4 w-48' />
                                <Skeleton className='h-4 w-32 ml-auto' />
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : requests?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className='py-16'>
                          <div className='flex flex-col items-center gap-4'>
                            <div className='w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center'>
                              <FiEdit3 className='w-10 h-10 text-rose-400' />
                            </div>
                            <div className='text-center'>
                              <p className='text-gray-700 font-semibold text-lg mb-1'>
                                No requests yet
                              </p>
                              <p className='text-gray-500 text-sm'>
                                Create your first edit request to get started
                              </p>
                            </div>
                            <button
                              onClick={() => openModal('add-request')}
                              className='mt-2 bg-rose-600 text-white px-6 py-2 rounded-xl hover:bg-rose-700 transition font-medium flex items-center gap-2'
                            >
                              <FiPlus className='w-4 h-4' />
                              Add a Request
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      requests?.map((request) => {
                        const timeLeft = Math.max(0, 20000 - (currentTime - new Date(request.createdAt).getTime()));
                        const canUndoRequest = canUndo(request.createdAt);
                        
                        return (
                        <TableRow key={request.id} className='hover:bg-muted/50 transition-colors'>
                          <TableCell className='font-medium'>
                            <div className='flex items-center gap-2'>
                              <FiCalendar className='w-4 h-4 text-gray-400' />
                              <span className='text-sm'>
                                {new Date(request.date).toLocaleDateString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className='font-medium text-foreground'>
                                {request.title}
                              </p>
                              <p className='text-sm text-muted-foreground truncate max-w-md'>
                                {request.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className='text-right'>
                            <div className='flex items-center justify-end gap-2'>
                              <button
                                onClick={() => handleViewRequest(request)}
                                className='inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 hover:underline text-sm font-medium transition-colors'
                              >
                                <FiEye className='w-4 h-4' />
                                View
                              </button>
                              {canUndoRequest && (
                                <div className='flex items-center gap-1'>
                                  <span className='text-xs text-gray-500'>
                                    {Math.ceil(timeLeft / 1000)}s
                                  </span>
                                  <button
                                    onClick={() => handleUndoRequest(request.id)}
                                    className='inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 hover:underline text-sm font-medium transition-colors'
                                    title='Undo request'
                                  >
                                    <FiRotateCcw className='w-4 h-4' />
                                    Undo
                                  </button>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )})
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </DisplayCard>
      </div>

      {/* Add Request Modal */}
      <Modal id='add-request'>
        <div className='flex flex-col p-8 max-w-md w-full'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-2 bg-rose-100 rounded-lg'>
              <FiPlus className='w-5 h-5 text-rose-600' />
            </div>
            <div>
              <h2 className='text-2xl font-bold'>Add New Request</h2>
              <p className='text-sm text-gray-600 mt-0.5'>
                Submit a new edit request for your website
              </p>
            </div>
          </div>
          
          <form onSubmit={handleCreateRequest} className='flex flex-col gap-4'>
            <div>
              <label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-1'>
                Request Title *
              </label>
              <input
                type='text'
                id='title'
                name='title'
                placeholder='e.g., Update homepage hero section'
                className='w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500'
                required
              />
            </div>
            
            <div>
              <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-1'>
                Description *
              </label>
              <textarea
                id='description'
                name='description'
                placeholder='Please describe the changes you would like to make...'
                rows={4}
                className='w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none'
                required
              />
            </div>
            
            <div className='flex gap-3 mt-2'>
              <button
                type='button'
                onClick={() => {
                  const modal = document.getElementById('add-request') as HTMLDialogElement;
                  if (modal) modal.close();
                }}
                className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isSubmitting}
                className='flex-1 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
