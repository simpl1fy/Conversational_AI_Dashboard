import { useState, useEffect, useRef } from "react";

export default function Chat() {

  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "ai" },
    { id: 2, text: "I need help building a chat UI.", sender: "user" },
  ]);

  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() && !file) return;

    const msg = {
      id: Date.now(),
      text: input,
      sender: "user",
      file,
    };

    setMessages((prev) => [...prev, msg]);
    setInput("");
    setFile(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-3 rounded-xl max-w-md shadow-sm
                ${m.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 border"}
              `}
            >
              {m.text}

              {m.file && (
                <div className="mt-2 text-sm opacity-80">
                  📎 {m.file.name}
                </div>
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />

      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">

        {file && (
          <div className="mb-2 flex items-center gap-3 text-sm text-gray-700 rounded-lg bg-gray-200 max-w-fit p-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">📎</span>
              <span className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">{file.name}</span>
            </div>

            <button
              type="button"
              onClick={() => setFile(null)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-400 text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Remove attached file"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">

          <label className="cursor-pointer p-2 rounded-lg hover:bg-gray-200">
            <span>📎</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          <textarea
            value={input}
            rows={1}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={sendMessage}
            className="p-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
          >
            Send
          </button>

        </div>
      </div>
    </div>
  );
}