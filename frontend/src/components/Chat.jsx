import { useState, useEffect } from 'react';
import { useScroll } from '../context/ScrollProvider';

export default function Chat() {

    const { bottomRef, scrollToBottom } = useScroll();

    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How can I help you today?", sender: 'ai' },
        { id: 2, text: "I need help with creating a conversational AI interface.", sender: 'user' },
        { id: 3, text: "I'd be happy to help you design a modern chat interface. What specific features are you looking for?", sender: 'ai' }
    ]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (inputValue.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: inputValue,
                sender: 'user'
            };
            setMessages([...messages, newMessage]);
            setInputValue('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-800 border border-gray-200'
                            }`}
                        >
                            {message.text}
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-4">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        onClick={handleSend}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}