import { useState } from 'react';
import { FiSend, FiMessageSquare, FiEdit3 } from 'react-icons/fi';
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
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate admin typing and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const adminMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your edit request! Our team will review it and get back to you within 24 hours.',
        sender: 'admin',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, adminMessage]);
    }, 1500);
  };

  return (
    <div className='flex flex-col h-full mx-4 md:mx-8'>
      <div className='flex flex-col gap-5 col-span-1'>
        <DisplayCard className='h-[800px] my-5 overflow-hidden'>
          <div className='h-full flex flex-col'>
            {/* Header */}
            <div className='px-6 py-4 border-b-2 border-rose-600'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-rose-100 rounded-lg'>
                  <FiEdit3 className='w-5 h-5 text-rose-600' />
                </div>
                <div>
                  <h3 className='font-bold ubuntu-font text-2xl'>
                    Request an Edit
                  </h3>
                  <p className='text-sm text-gray-600 mt-0.5'>
                    Chat with our team about website changes
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area - Fixed height container */}
            <div className='flex-1 flex flex-col p-6 min-h-0'>
              {messages.length === 0 ? (
                <div className='flex-1 flex items-center justify-center'>
                  <div className='text-center max-w-sm'>
                    <div className='w-20 h-20 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                      <FiMessageSquare className='w-8 h-8 text-rose-600' />
                    </div>
                    <p className='text-gray-900 font-semibold text-lg mb-2'>
                      No messages yet
                    </p>
                    <p className='text-gray-600 text-sm leading-relaxed'>
                      Start a conversation with our team to request edits, ask
                      questions, or discuss changes for your website
                    </p>
                    <div className='mt-6 flex justify-center gap-2 text-xs'>
                      <span className='px-3 py-1 border border-gray-300 text-gray-700 rounded-full'>
                        💬 Live chat
                      </span>
                      <span className='px-3 py-1 border border-gray-300 text-gray-700 rounded-full'>
                        ⏱️ Fast response
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='flex-1 overflow-y-auto space-y-4 mb-4 pr-2 min-h-0'>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-rose-600 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-900 rounded-bl-none'
                        }`}
                      >
                        <p className='text-sm leading-relaxed'>
                          {message.text}
                        </p>
                        <div
                          className={`flex items-center gap-1 mt-2 ${
                            message.sender === 'user'
                              ? 'justify-end'
                              : 'justify-start'
                          }`}
                        >
                          <span
                            className={`text-[10px] ${
                              message.sender === 'user'
                                ? 'text-rose-200'
                                : 'text-gray-500'
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {message.sender === 'user' && (
                            <span className='text-[10px] text-rose-200'>✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className='flex justify-start'>
                      <div className='bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none'>
                        <div className='flex gap-1'>
                          <span className='w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]'></span>
                          <span className='w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]'></span>
                          <span className='w-2 h-2 bg-gray-500 rounded-full animate-bounce'></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className='mt-auto'>
                <div className='flex items-center gap-2'>
                  <div className='flex-1 flex items-center border-2 border-gray-500 rounded-2xl focus-within:border-rose-600 transition-colors'>
                    <input
                      type='text'
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder='Type your edit request...'
                      className='flex-1 px-4 py-3 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-500'
                    />

                    <button
                      type='submit'
                      disabled={!inputText.trim()}
                      className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-medium bg-rose-600 text-white hover:bg-rose-700 transition-colors`}
                    >
                      <span className='hidden sm:inline'>Send</span>
                      <FiSend className='w-4 h-4' />
                    </button>
                  </div>
                </div>

                <p className='text-xs text-gray-400 mt-2 text-center'>
                  Our team typically responds within a few hours
                </p>
              </form>
            </div>
          </div>
        </DisplayCard>
      </div>
    </div>
  );
}
