import { useState } from "react";
import { chatwithAi } from "../Service/chatService";

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [input, setInput] = useState("");
  // const [isTyping, setIsTyping] = useState(false);

  const toggleChatbox = () => setIsOpen((prev) => !prev);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev: any) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    // setIsTyping(true);
    const aiResponse = await mockAIResponse(input);

    simulateTypingEffect(aiResponse);
  };

  const simulateTypingEffect = (text: string) => {
    let index = 0;

    // Add a placeholder AI message to simulate typing
    const aiMessagePlaceholder = { text: "", sender: "ai" };
    setMessages((prev: any) => [...prev, aiMessagePlaceholder]);

    const interval = setInterval(() => {
      if (index < text.length) {
        const currentText = text.substring(0, index + 1);

        setMessages((prev: any) => {
          const otherMessages = prev.slice(0, prev.length - 1); // Exclude the last (placeholder) AI message
          const updatedAiMessage = { text: currentText, sender: "ai" };
          return [...otherMessages, updatedAiMessage];
        });

        index++;
      } else {
        clearInterval(interval);
        // setIsTyping(false);
      }
    }, 50); // Adjust speed of typing effect
  };

  const mockAIResponse = async (message: any) => {
    const sendMessage = {
      prompt: message,
    };
    const response = await chatwithAi(sendMessage);
    return response.data.response;
  };

  return (
<div className="fixed bottom-4 z-50 right-4 left-4 md:left-auto">
<div
        className={`w-72 bg-white shadow-lg border rounded-lg overflow-hidden transition-transform duration-300 ${
          isOpen ? "transform scale-100" : "transform scale-0"
        }`}
      >
        <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center">
          <h2 className="text-lg font-bold">AI Chat</h2>
          <button
            onClick={toggleChatbox}
            className="text-xl font-bold focus:outline-none"
          >
            ×
          </button>
        </div>
        <div className="p-4 h-64 overflow-y-auto">
          {messages.map((message: any, index: any) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                message.sender === "user"
                  ? "bg-gray-200 text-right"
                  : "bg-gray-900 text-white"
              }`}
            >
              {message.text}
            </div>
          ))}
          {/* {isTyping && <div className="text-gray-900">AI is typing...</div>} */}
        </div>
        <div className="flex gap-2 items-center border-t p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded px-2 py-1"
            placeholder="Type your message..."
          />
          <i onClick={handleSendMessage} className="fa-solid fa-paper-plane cursor-pointer"></i>
          {/* <button
            onClick={handleSendMessage}
            className="bg-gray-900 text-white px-4 py-1 ml-2 rounded"
          >
            Send
          </button> */}
        </div>
      </div>
      <button
        onClick={toggleChatbox}
        className="bg-gray-900 text-white rounded-full w-12 h-12 shadow-lg focus:outline-none"
      >
        💬
      </button>
    </div>
  );
};

export default Chatbox;
