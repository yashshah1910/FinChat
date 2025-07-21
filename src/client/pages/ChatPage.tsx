import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { modelenceMutation } from '@modelence/react-query';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI finance assistant. I can help you track expenses and answer questions about your spending. Try saying something like '₹500 pizza' or 'How much have I spent?'",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: sendMessage, isPending: isSending } = useMutation(
    modelenceMutation("finchat.sendMessage")
  );

  const handleLogout = () => {
    localStorage.removeItem("modelence.session");
    window.location.href = "/auth/login";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const apiResponse = await sendMessage({ message: inputMessage });
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: (apiResponse as any).response || "Sorry, I couldn't process that.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <div className="bg-white shadow-lg border-b border-gray-200 backdrop-blur-sm bg-opacity-95 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">FinChat</h1>
                <p className="text-gray-600 text-sm">AI-powered expense tracking</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/app/expenses"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                }`}>
                  {message.sender === 'user' ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl shadow-md ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  {message.sender === 'bot' ? (
                    <div className="text-sm leading-relaxed prose prose-sm max-w-none 
                      prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-2
                      prose-p:text-gray-700 prose-p:my-2 prose-p:leading-relaxed
                      prose-strong:text-gray-900 prose-strong:font-semibold
                      prose-ul:text-gray-700 prose-ul:my-2 prose-ul:pl-4
                      prose-li:text-gray-700 prose-li:my-0.5
                      prose-h3:text-base prose-h3:font-semibold prose-h3:text-gray-900
                      prose-h4:text-sm prose-h4:font-medium prose-h4:text-gray-800">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  )}
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {(isLoading || isSending) && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto p-6">
          {messages.length <= 1 && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3 font-medium">Try these examples:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  "₹500 pizza",
                  "200 uber ride", 
                  "How much have I spent?",
                  "1200 groceries",
                  "Delete records till June"
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(example)}
                    className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl text-sm hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex space-x-4 items-stretch">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message... (e.g., '₹500 pizza' or 'How much have I spent?')"
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none shadow-sm hover:shadow-md transition-all duration-200 h-12"
                rows={1}
                disabled={isLoading || isSending}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={isLoading || isSending || !inputMessage.trim()}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-3 rounded-2xl hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center flex-shrink-0 h-12"
            >
              {(isLoading || isSending) ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
