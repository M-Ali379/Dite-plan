import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const ChatBot = ({ currentDietPlan }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! How can I help you with your diet plan today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, isBot: false };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input, dietPlan: currentDietPlan })
            });
            const data = await response.json();

            setMessages((prev) => [...prev, { text: data.reply, isBot: true }]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prev) => [...prev, { text: "Sorry, I couldn't reach the server right now.", isBot: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window Overlay */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right">
                    <div className="bg-primary-green p-4 flex justify-between items-center text-white">
                        <h3 className="font-bold flex items-center gap-2">
                            <MessageCircle size={18} /> NutriGen AI
                        </h3>
                        <button onClick={toggleChat} className="hover:text-soft-orange transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-4 h-80 overflow-y-auto flex flex-col gap-3 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`max-w-[80%] p-3 rounded-2xl ${msg.isBot ? 'bg-white border border-gray-100 text-gray-800 self-start rounded-tl-sm' : 'bg-mint text-primary-green self-end rounded-tr-sm font-medium'}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="bg-white border border-gray-100 text-gray-500 self-start rounded-2xl rounded-tl-sm p-3 text-sm flex items-center gap-1.5 font-medium">
                                <span>Thinking...</span>
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent"
                            placeholder="Ask about your meals..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-primary-green hover:bg-[#1a3a1a] text-white p-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={toggleChat}
                className={`${isOpen ? 'bg-gray-800' : 'bg-primary-green'} text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>
        </div>
    );
};

export default ChatBot;
