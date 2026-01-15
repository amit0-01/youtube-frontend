import { useEffect, useRef, useState } from "react";
import { chatwithAi } from "../Service/chatService";
import { useChat } from "../Context/ChatProvider";

const Chatbox = () => {
  const { chatHistory, setChatHistory } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggleChatbox = () => setIsOpen((prev) => !prev);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { text: input, sender: "user" };
    setChatHistory((prev: any) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await getAIResponse(input);
      simulateTypingEffect(response);
    } catch (error) {
      setIsTyping(false);
      simulateTypingEffect("I'm having trouble connecting. Please try again.");
    }
  };

  const simulateTypingEffect = (text: string) => {
    setIsTyping(false); // Remove "typing" indicator before starting effect
    let index = 0;
    const aiMessagePlaceholder = { text: "", sender: "ai" };
    setChatHistory((prev: any) => [...prev, aiMessagePlaceholder]);

    const interval = setInterval(() => {
      if (index < text.length) {
        const currentText = text.substring(0, index + 1);
        setChatHistory((prev: any) => {
          const rest = prev.slice(0, -1);
          return [...rest, { text: currentText, sender: "ai" }];
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  };

  const getAIResponse = async (message: string) => {
    const response = await chatwithAi({ prompt: message });
    return response.data.response;
  };

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[350px] md:w-[400px] transition-all duration-500 ease-in-out transform ${
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <div className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[500px]">
          
          {/* Header - Minimalist & Elegant */}
          <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">AI Assistant</h2>
            </div>
            <button onClick={toggleChatbox} className="text-gray-400 hover:text-gray-600 transition-colors">
              <i className="fa-solid fa-chevron-down text-sm"></i>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
            {chatHistory.map((message: any, index: any) => (
              <div
                key={index}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    message.sender === "user"
                      ? "bg-gray-800 text-white rounded-2xl rounded-tr-none"
                      : "bg-white text-gray-700 border border-gray-100 rounded-2xl rounded-tl-none"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator Bubble */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Message AI..."
                className="w-full bg-gray-100 text-gray-800 text-sm rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all placeholder:text-gray-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-2 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={toggleChatbox}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? "bg-white text-gray-800 rotate-90" : "bg-gray-900 text-white"
        }`}
      >
        {isOpen ? (
          <i className="fa-solid fa-xmark text-xl"></i>
        ) : (
          <i className="fa-solid fa-comment-dots text-xl"></i>
        )}
      </button>
    </>
  );
};

export default Chatbox;