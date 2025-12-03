import React, { useEffect, useState } from "react";
import Field from "@/components/form/Field";
import { useFormValidator } from "./form/useFormValidation";

// 🔥 Tipo do formulário
export type ChatFormValues = {
    receiver: string;
    message: string;
};

interface ModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (chat: ChatFormValues) => void;
}

export const ChatModal: React.FC<ModalProps> = ({ open, onClose, onSubmit }) => {
    const [mounted, setMounted] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    const [form, setForm] = useState<ChatFormValues>({
        receiver: "",
        message: "",
    });

    const validators = {
        receiver: [(v: string) => (!v ? "Destinatário é obrigatório" : null)],
        message: [(v: string) => (!v ? "Mensagem é obrigatória" : null)],
    };

    const { errors, touched, setTouched, validateField, validateForm } =
        useFormValidator(validators);

    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setTouched((prev) => ({ ...prev, [name]: true }));
        validateField(name as keyof ChatFormValues, value);
    };

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
                    receiver: "",
                    message: "",
                });
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [open]);

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

        onSubmit(form);
    };

    if (!mounted) return null;

    return (
        <div
            className={`fixed inset-0 z-50 ${animateIn ? "bg-black bg-opacity-60" : "bg-black bg-opacity-0"
                } transition`}
            onClick={onClose}
        >
            <div
                className={`fixed right-0 top-0 h-full bg-[#131313] min-w-[740px] border-l border-[#222630] text-white transform transition ${animateIn
                        ? "translate-x-0 opacity-100"
                        : "translate-x-full opacity-0"
                    } rounded-l-xl`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-center border-b border-gray-700 px-6 py-4">
                    <h2 className="text-white text-lg font-semibold">
                        Enviar Mensagem
                    </h2>
                </div>

                <form className="flex flex-col gap-6 p-8" onSubmit={handleSubmit}>
                    {/* Destinatário */}
                    <Field
                        label="Destinatário"
                        required
                        error={errors.receiver ?? undefined}
                        touched={touched.receiver}
                    >
                        <input
                            type="text"
                            name="receiver"
                            className={`w-full bg-[#131516] border ${errors.receiver && touched.receiver
                                    ? "border-red-500"
                                    : "border-[#2a2e38]"
                                } text-[#B0B7BE] px-3 py-2 rounded-md`}
                            value={form.receiver}
                            onChange={(e) =>
                                setForm({ ...form, receiver: e.target.value })
                            }
                            onBlur={handleBlur}
                        />
                    </Field>

                    {/* Mensagem */}
                    <Field
                        label="Mensagem"
                        required
                        error={errors.message ?? undefined}
                        touched={touched.message}
                    >
                        <textarea
                            name="message"
                            className={`w-full h-40 bg-[#131516] border ${errors.message && touched.message
                                    ? "border-red-500"
                                    : "border-[#2a2e38]"
                                } text-[#B0B7BE] px-3 py-2 rounded-md resize-none`}
                            value={form.message}
                            onChange={(e) =>
                                setForm({ ...form, message: e.target.value })
                            }
                            onBlur={handleBlur}
                        />
                    </Field>

                    {/* Botão */}
                    <button
                        type="submit"
                        className="bg-[#1B3F1B] hover:bg-green-700 text-green-400 px-4 py-2 rounded-2xl transition shadow-md"
                    >
                        Enviar Mensagem
                    </button>
                </form>
            </div>
        </div>
    );
};
