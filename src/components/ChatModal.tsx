import React, { useEffect, useState, useRef } from "react";
import { useWebSocket, Message } from "@/hooks/useWebSocket";
import { IClassRoom } from "@/lib/api/classRoom/classTypes";
import { User } from "@/lib/api/users/userTypes";
import { formatDate } from "@/utils/FormattedDate";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    studentId: string;
    studentName: string;
    classRooms: IClassRoom[];
    userClassRooms: IClassRoom[]; // Salas que o aluno pode acessar (já filtradas)
}

export const ChatModal: React.FC<ModalProps> = ({
    open,
    onClose,
    studentId,
    studentName,
    classRooms,
    userClassRooms,
}) => {
    const [mounted, setMounted] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);
    const [selectedClassRoom, setSelectedClassRoom] = useState<string>("");
    const [messageText, setMessageText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { messages, isConnected, error, sendMessage } = useWebSocket({
        studentId,
        classRoomName: selectedClassRoom,
        enabled: open && !!selectedClassRoom,
    });

    // Scroll para a última mensagem
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Controle do modal + reset
    useEffect(() => {
        if (open) {
            setMounted(true);
            const id = requestAnimationFrame(() => setAnimateIn(true));
            return () => cancelAnimationFrame(id);
        } else {
            setAnimateIn(false);
            const timer = setTimeout(() => {
                setMounted(false);
                setMessageText("");
                setSelectedClassRoom("");
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [open]);

    /**
     * POR QUÊ: Quando o modal abre, já define a sala selecionada.
     * A sala vem do modal de login (userClassRooms já contém apenas a sala selecionada),
     * então não precisa selecionar manualmente.
     */
    useEffect(() => {
        if (open && userClassRooms.length > 0) {
            // userClassRooms já vem filtrado com apenas a sala selecionada no login
            setSelectedClassRoom(userClassRooms[0].name);
        }
    }, [open, userClassRooms]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim() || !isConnected) return;

        sendMessage(messageText.trim());
        setMessageText("");
    };

    if (!mounted) return null;

    return (
        <div
            className={`fixed inset-0 z-50 ${
                animateIn ? "bg-black bg-opacity-60" : "bg-black bg-opacity-0"
            } transition`}
            onClick={onClose}
        >
            <div
                className={`fixed right-0 top-0 h-full bg-[#131313] min-w-[740px] border-l border-[#222630] text-white transform transition ${
                    animateIn
                        ? "translate-x-0 opacity-100"
                        : "translate-x-full opacity-0"
                } rounded-l-xl flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
                    <h2 className="text-white text-lg font-semibold">Chat</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Seleção de Sala */}
                <div className="px-6 py-4 border-b border-gray-700">
                    <label className="text-xs text-gray-400 mb-2 block">
                        Sala de Aula
                    </label>
                    <select
                        value={selectedClassRoom}
                        onChange={(e) => setSelectedClassRoom(e.target.value)}
                        className="w-full bg-[#131516] border border-[#2a2e38] text-[#B0B7BE] px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                        disabled={!isConnected}
                    >
                        <option value="">Selecione uma sala</option>
                        {userClassRooms.map((room) => (
                            <option key={room.id} value={room.name}>
                                {room.name}
                            </option>
                        ))}
                    </select>
                    {error && (
                        <p className="text-red-500 text-xs mt-2">{error}</p>
                    )}
                    {isConnected && selectedClassRoom && (
                        <p className="text-green-500 text-xs mt-2">
                            ✓ Conectado à sala {selectedClassRoom}
                        </p>
                    )}
                </div>

                {/* Área de Mensagens */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {!selectedClassRoom ? (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Selecione uma sala de aula para começar a conversar
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Nenhuma mensagem ainda. Seja o primeiro a enviar!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message) => {
                                const isOwnMessage = message.user.id === studentId;
                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${
                                            isOwnMessage
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                                isOwnMessage
                                                    ? "bg-green-600 text-white"
                                                    : "bg-[#222729] text-[#B0B7BE]"
                                            }`}
                                        >
                                            {!isOwnMessage && (
                                                <p className="text-xs font-semibold mb-1">
                                                    {message.user.name}
                                                </p>
                                            )}
                                            <p className="text-sm">
                                                {message.text}
                                            </p>
                                            <p
                                                className={`text-xs mt-1 ${
                                                    isOwnMessage
                                                        ? "text-green-100"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                {formatDate(message.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input de Mensagem */}
                {selectedClassRoom && (
                    <form
                        onSubmit={handleSendMessage}
                        className="border-t border-gray-700 px-6 py-4"
                    >
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Digite sua mensagem..."
                                className="flex-1 bg-[#131516] border border-[#2a2e38] text-[#B0B7BE] px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                                disabled={!isConnected}
                            />
                            <button
                                type="submit"
                                disabled={!isConnected || !messageText.trim()}
                                className="bg-[#1B3F1B] hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-green-400 px-6 py-2 rounded-md transition shadow-md"
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
