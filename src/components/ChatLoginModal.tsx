import React, { useEffect, useState } from "react";
import Field from "@/components/form/Field";
import { useFormValidator } from "./form/useFormValidation";
import { IClassRoom } from "@/lib/api/classRoom/classTypes";
import { User } from "@/lib/api/users/userTypes";

interface ChatLoginModalProps {
    open: boolean;
    onClose: () => void;
    onLogin: (studentId: string, studentName: string, classRoomName: string) => void;
    users: User[];
    classRooms: IClassRoom[];
}

export const ChatLoginModal: React.FC<ChatLoginModalProps> = ({
    open,
    onClose,
    onLogin,
    users,
    classRooms,
}) => {
    const [mounted, setMounted] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);
    const [form, setForm] = useState({
        studentName: "",
        classRoomName: "",
    });

    const validators = {
        studentName: [(v: string) => (!v ? "Nome do aluno é obrigatório" : null)],
        classRoomName: [(v: string) => (!v ? "Sala de aula é obrigatória" : null)],
    };

    const { errors, touched, setTouched, validateField, validateForm } =
        useFormValidator(validators);

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
                setForm({
                    studentName: "",
                    classRoomName: "",
                });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        validateField(name as keyof typeof form, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm(form)) {
            setTouched(
                Object.keys(form).reduce((acc, key) => {
                    acc[key] = true;
                    return acc;
                }, {} as Record<string, boolean>)
            );
            return;
        }

        // Encontra o usuário selecionado
        const selectedUser = users.find((u) => u.name === form.studentName);
        if (!selectedUser) {
            alert("Usuário não encontrado");
            return;
        }

        // Chama a função de login com os dados
        onLogin(String(selectedUser.id), selectedUser.name, form.classRoomName);
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
                className={`fixed inset-0 flex items-center justify-center ${
                    animateIn ? "opacity-100" : "opacity-0"
                } transition`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-[#131313] border border-[#222630] rounded-xl p-8 min-w-[500px] text-white">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Entrar no Chat</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition"
                        >
                            ✕
                        </button>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        {/* Seleção de Aluno */}
                        <Field
                            label="Nome do Aluno"
                            required
                            error={errors.studentName ?? undefined}
                            touched={touched.studentName}
                        >
                            <select
                                name="studentName"
                                value={form.studentName}
                                onChange={(e) =>
                                    setForm({ ...form, studentName: e.target.value })
                                }
                                onBlur={handleBlur}
                                className={`w-full bg-[#131516] border ${
                                    errors.studentName && touched.studentName
                                        ? "border-red-500"
                                        : "border-[#2a2e38]"
                                } text-[#B0B7BE] px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500`}
                            >
                                <option value="">Selecione um aluno</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.name}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        {/* Seleção de Sala */}
                        <Field
                            label="Sala de Aula"
                            required
                            error={errors.classRoomName ?? undefined}
                            touched={touched.classRoomName}
                        >
                            <select
                                name="classRoomName"
                                value={form.classRoomName}
                                onChange={(e) =>
                                    setForm({ ...form, classRoomName: e.target.value })
                                }
                                onBlur={handleBlur}
                                className={`w-full bg-[#131516] border ${
                                    errors.classRoomName && touched.classRoomName
                                        ? "border-red-500"
                                        : "border-[#2a2e38]"
                                } text-[#B0B7BE] px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500`}
                            >
                                <option value="">Selecione uma sala</option>
                                {classRooms.map((room) => (
                                    <option key={room.id} value={room.name}>
                                        {room.name}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        {/* Botões */}
                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-[#2a2e38] hover:bg-[#3a3e48] text-[#B0B7BE] px-4 py-2 rounded-md transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-[#1B3F1B] hover:bg-green-700 text-green-400 px-4 py-2 rounded-md transition-colors shadow-md"
                            >
                                Entrar no Chat
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

