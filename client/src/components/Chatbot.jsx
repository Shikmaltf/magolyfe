// frontend/src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Loader2, Bot, ChevronDown, ChevronsUp } from 'lucide-react';
import axios from 'axios';
import { marked } from 'marked';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const CHAT_STORAGE_KEY = 'magolyfeChatHistory';

marked.setOptions({
  breaks: true,
  gfm: true,
});

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const storedMessages = sessionStorage.getItem(CHAT_STORAGE_KEY);
      if (storedMessages) {
        return JSON.parse(storedMessages);
      }
    } catch (error) {
      console.error("Error reading chat history from sessionStorage:", error);
    }
    return [{ sender: 'bot', text: 'Halo! Saya asisten virtual Magolyfe. Ada yang bisa saya bantu?' }];
  });

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [botResponseToAnimate, setBotResponseToAnimate] = useState(null);
  const messagesEndRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving chat history to sessionStorage:", error);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const toggleChatOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen) { 
        setIsMinimized(false); 
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
            if (botResponseToAnimate) {
                const currentMessages = messagesRef.current;
                const lastMessageIndex = currentMessages.length - 1;
                if (lastMessageIndex >= 0 && currentMessages[lastMessageIndex]?.sender === 'bot' && currentMessages[lastMessageIndex]?.text.length < botResponseToAnimate.length) {
                    setMessages(prevMessages => {
                        const updatedMessages = [...prevMessages];
                        if (updatedMessages.length > 0 && updatedMessages[lastMessageIndex]?.sender === 'bot') {
                            updatedMessages[lastMessageIndex] = { ...updatedMessages[lastMessageIndex], text: botResponseToAnimate };
                        }
                        return updatedMessages;
                    });
                }
                setBotResponseToAnimate(null);
            }
            setIsLoading(false);
            setIsAnimating(false);
        }
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (inputValue.trim() === '' || isLoading) return;

    const newMessage = { sender: 'user', text: inputValue };
    const historyToSend = [...messagesRef.current];

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputValue('');
    
    setIsLoading(true); 
    setIsAnimating(false);

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    setBotResponseToAnimate(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chatbot/chat`, {
        message: newMessage.text,
        history: historyToSend 
      });
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: '' }]); 
      setBotResponseToAnimate(response.data.reply); 
    } catch (error) {
      console.error("Error sending message to chatbot API:", error);
      const errorReply = { sender: 'bot', text: 'Maaf, terjadi kesalahan pada sistem kami. Silakan coba lagi nanti.' };
      setMessages(prevMessages => [...prevMessages, errorReply]);
      setIsLoading(false);
      setIsAnimating(false);
    }
  };

  useEffect(() => {
    if (!botResponseToAnimate && typingIntervalRef.current === null) {
      if (isAnimating) setIsAnimating(false);
      return;
    }
    if (typingIntervalRef.current && !botResponseToAnimate) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
      if (isAnimating) setIsAnimating(false);
    }
    if (!botResponseToAnimate) {
      if (isLoading && !isAnimating) {
        setIsLoading(false);
      }
      return;
    }
    if (messagesRef.current.length === 0) return;

    const lastMessageIndex = messagesRef.current.length - 1;
    const lastMessage = messagesRef.current[lastMessageIndex];

    if (lastMessage && lastMessage.sender === 'bot') {
      const charsToAnimate = botResponseToAnimate.split('');
      let charIndex = lastMessage.text.length; 
      const typingSpeedPerChar = 20; 

      if (charIndex < charsToAnimate.length) {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
        setIsAnimating(true); 
        typingIntervalRef.current = setInterval(() => {
          const currentMessages = messagesRef.current;
          const currentLastMessageIndex = currentMessages.length - 1;
          if (currentLastMessageIndex < 0 || !currentMessages[currentLastMessageIndex] || currentMessages[currentLastMessageIndex].sender !== 'bot') {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
            setIsAnimating(false);
            if(isLoading) setIsLoading(false); 
            return;
          }
          const currentBotMessageText = currentMessages[currentLastMessageIndex].text;
          if (currentBotMessageText.length < charsToAnimate.length) {
            const nextChar = charsToAnimate[currentBotMessageText.length];
            setMessages(prevMsgs => {
              const updatedMsgs = [...prevMsgs];
              const lastIdx = updatedMsgs.length - 1;
              if (lastIdx >= 0 && updatedMsgs[lastIdx] && updatedMsgs[lastIdx].sender === 'bot') {
                updatedMsgs[lastIdx] = { ...updatedMsgs[lastIdx], text: updatedMsgs[lastIdx].text + nextChar };
              }
              return updatedMsgs;
            });
          } else {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
            setBotResponseToAnimate(null);
            setIsLoading(false);
            setIsAnimating(false);
          }
        }, typingSpeedPerChar);
      } else {
        if (typingIntervalRef.current) { 
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
        setBotResponseToAnimate(null);
        setIsLoading(false);
        setIsAnimating(false);
      }
    } else if (isLoading && !isAnimating) {
      setIsLoading(false);
    }
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [botResponseToAnimate, messages.length, isLoading, isAnimating]);

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleChatOpen}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 z-50"
          aria-label="Buka Chatbot"
        >
          <MessageSquare size={28} />
        </button>
      )}

      {isOpen && (
        <div 
            className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 bg-white w-full sm:w-96 shadow-xl flex flex-col z-50 border border-gray-300 sm:rounded-lg transition-all duration-300 ease-in-out ${
                isMinimized ? 'h-16 sm:h-16 overflow-hidden' : 'h-full sm:h-[75vh] sm:max-h-[600px]'
            }`}
        >
          {/* Header Chatbot */}
          <div className="bg-green-700 text-white p-3 flex justify-between items-center sm:rounded-t-lg cursor-pointer" onClick={isMinimized ? toggleMinimize : undefined}>
            <div className="flex items-center space-x-3">
              <Bot size={22} />
              <h3 className="font-medium text-md">Magolyfe Assistant</h3>
            </div>
            <div className="flex items-center space-x-1">
                <button
                    onClick={toggleMinimize}
                    className="text-green-100 hover:text-white focus:outline-none p-1.5 rounded-full hover:bg-green-800 transition-colors"
                    aria-label={isMinimized ? "Maksimalkan Chat" : "Minimalkan Chat"}
                >
                    {isMinimized ? <ChevronsUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <button
                    onClick={toggleChatOpen}
                    className="text-green-100 hover:text-white focus:outline-none p-1.5 rounded-full hover:bg-green-800 transition-colors"
                    aria-label="Tutup Chatbot"
                >
                    <X size={18} />
                </button>
            </div>
          </div>

          {/* Area Pesan (tidak ditampilkan jika diminimize) */}
          {!isMinimized && (
            <>
              <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-green-500 text-white rounded-br-none prose-invert prose-p:text-white prose-strong:text-white prose-a:text-green-200 hover:prose-a:text-green-100' 
                          : 'bg-gray-200 text-gray-800 rounded-bl-none border border-gray-200 prose-a:text-green-600 hover:prose-a:text-green-500'
                      } prose prose-sm max-w-none`}
                    >
                      {msg.sender === 'bot' ? (
                        <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.text || "") }} />
                      ) : (
                        msg.text.split('\n').map((line, i, arr) => (
                            <React.Fragment key={i}>
                              {line}
                              {i < arr.length - 1 && <br />}
                            </React.Fragment>
                          ))
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && !isAnimating && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-700 p-3 rounded-lg rounded-bl-none border border-gray-200 shadow-sm inline-flex items-center space-x-2">
                      <Loader2 size={18} className="animate-spin text-green-600" />
                      <span className="text-xs">Asisten sedang mengetik...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Form Input Pesan */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white sm:rounded-b-lg">
                <div className="flex items-center space-x-2">
                  <input
                    type="text" 
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={isLoading ? "Memproses..." : "Ketik pesan Anda di sini..."}
                    className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow text-sm"
                    disabled={isLoading}
                  />
                  <button
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                    disabled={isLoading || inputValue.trim() === ''}
                    aria-label="Kirim Pesan"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
