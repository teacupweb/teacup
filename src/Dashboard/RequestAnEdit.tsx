import { useState } from 'react';
import DisplayCard from '@/Components/DisplayCards';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: Date;
}

export default function RequestAnEdit() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate admin response after a short delay
    setTimeout(() => {
      const adminMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your edit request! We will review it and get back to you soon.',
        sender: 'admin',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, adminMessage]);
    }, 1000);
  };

  return (
    <div className='flex flex-col h-full mx-8'>
      <div className='flex flex-col gap-5 col-span-1'>
        <DisplayCard className='min-h-[500px] my-5'>
          <div className='h-full flex flex-col'>
            <div className='pt-5 pb-2 mb-3 border-b-2 border-rose-600'>
              <h3 className='font-bold ubuntu-font text-2xl'>Request an Edit</h3>
            </div>
            
            <div className='flex-1 flex flex-col p-4'>
              {messages.length === 0 ? (
                <div className='flex-1 flex items-center justify-center'>
                  <div className='text-center'>
                    <div className='w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <svg
                        className='w-8 h-8 text-rose-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                        />
                      </svg>
                    </div>
                    <p className='text-gray-700 font-semibold text-lg mb-1'>
                      No messages yet
                    </p>
                    <p className='text-gray-500 text-sm'>
                      Start a conversation to request edits for your website
                    </p>
                  </div>
                </div>
              ) : (
                <div className='flex-1 overflow-y-auto space-y-4 mb-4'>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-rose-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className='text-sm'>{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-rose-100' : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSendMessage} className='flex gap-2'>
                <input
                  type='text'
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder='Type your edit request...'
                  className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500'
                />
                <button
                  type='submit'
                  className='px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 transition'
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </DisplayCard>
      </div>
    </div>
  );
}
