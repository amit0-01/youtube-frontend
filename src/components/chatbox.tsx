import { useState } from "react";
import { chatwithAi } from "../Service/chatService";
import { useChat } from "../Context/ChatProvider";

const Chatbox = () => {
  const { chatHistory, setChatHistory } = useChat(); // Use context for persistent chat history
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const toggleChatbox = () => setIsOpen((prev) => !prev);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // User message
    const userMessage = { text: input, sender: "user" };
    const updatedChatHistory :any = [...chatHistory, userMessage];
    setChatHistory(updatedChatHistory); // Update context
    setInput("");

    // Simulate AI response
    try {
      const aiResponse = await getAIResponse(input);
      simulateTypingEffect(aiResponse);
    } catch (error) {
      simulateTypingEffect("Sorry, I couldn't process that request.");
    }
  };

  const simulateTypingEffect = (text: string) => {
    let index = 0;

    // Add a placeholder AI message
    const aiMessagePlaceholder:any = { text: "", sender: "ai" };
    setChatHistory((prev) => [...prev, aiMessagePlaceholder]);

    const interval = setInterval(() => {
      if (index < text.length) {
        const currentText = text.substring(0, index + 1);

        setChatHistory((prev:any) => {
          const messagesExcludingLast = prev.slice(0, prev.length - 1); // Exclude placeholder
          const updatedAiMessage = { text: currentText, sender: "ai" };
          return [...messagesExcludingLast, updatedAiMessage];
        });

        index++;
      } else {
        clearInterval(interval);
      }
    }, 50); // Adjust speed of typing effect
  };

  const getAIResponse = async (message: string) => {
    const sendMessage = { prompt: message };
    const response = await chatwithAi(sendMessage);
    return response.data.response; // Ensure this matches your backend structure
  };

  return (
    <>
<div className={`fixed bottom-20 z-50 right-4 left-4 md:left-auto ${!isOpen ? 'hidden' : ''}`}>
{/* Chatbox */}
      <div
        className={`w-72 bg-white shadow-lg border rounded-lg overflow-hidden transition-transform duration-300 ${
          isOpen ? "transform scale-100" : "transform scale-0"
        }`}
      >
        {/* Header */}
        <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center">
          <h2 className="text-lg font-bold">AI Chat</h2>
          <button
            onClick={toggleChatbox}
            className="text-xl font-bold focus:outline-none"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="p-4 h-64 overflow-y-auto">
          {chatHistory.map((message:any, index:any) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                message.sender === "user"
                  ? "bg-gray-500 text-right"
                  : "bg-gray-900 text-white"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2 items-center border-t p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded px-2 py-1 text-black"
            placeholder="Type your message..."
          />
          <i
            onClick={handleSendMessage}
            className="fa-solid fa-paper-plane cursor-pointer text-gray-900"
            aria-hidden="true"
          ></i>
        </div>
      </div>

      {/* Toggle Button */}
   
    </div>
    <div className="fixed bottom-4 z-50 right-4 left-4 md:left-auto">
       <button
       onClick={toggleChatbox}
       className="bg-gray-900 text-white rounded-full w-12 h-12 shadow-lg focus:outline-none"
     >
       💬
     </button>
     </div>
     </>
  );
};

export default Chatbox;
