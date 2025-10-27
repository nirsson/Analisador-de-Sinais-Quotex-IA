import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { continueChat } from '../services/geminiService';
import { LoadingSpinner } from './icons';

export const ChatBot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', content: "Olá! Sou seu assistente de negociação. Pergunte-me qualquer coisa sobre conceitos de negociação, estratégias ou análise de mercado." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await continueChat(newMessages);
            setMessages(prev => [...prev, { role: 'model', content: response }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'model', content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto w-full bg-gray-800 rounded-xl shadow-2xl">
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-lg px-4 py-2 rounded-lg shadow ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="max-w-lg px-4 py-2 rounded-lg shadow bg-gray-700 text-gray-200 flex items-center">
                                <LoadingSpinner/>
                                <span className="ml-2">Pensando...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Faça uma pergunta sobre negociação..."
                        className="flex-1 p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-white"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
};