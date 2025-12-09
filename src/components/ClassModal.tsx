import React, { useEffect, useState } from "react";
import Field from "@/components/form/Field";
import { useFormValidator } from "./form/useFormValidation";
import { CreateClass } from "@/lib/api/classRoom/classTypes";

// Importa o hook dinâmico já tipado

// 🔥 Tipo do formulário (único, não duplicar!)
export type UserFormValues = {
    name: string
    ageRange: string
    description: string
};

interface ModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (user: CreateClass) => void;
}

export const CreateClassModal: React.FC<ModalProps> = ({ open, onClose, onSubmit }) => {

    const [mounted, setMounted] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    // 🔥 Estado alinhado com UserFormValues
    const [form, setForm] = useState<UserFormValues>({
        name: "",
        ageRange: "",
        description: "",

    });
    const ageRanges = [
        "6 a 7",   // 1º ano (1ª série)
        "7 a 8",   // 2º ano
        "8 a 9",   // 3º ano
        "9 a 10",  // 4º ano
        "10 a 11", // 5º ano
        "11 a 12", // 6º ano
        "12 a 13", // 7º ano
        "13 a 14", // 8º ano
        "14 a 15", // 9º ano
        "15 a 16", // 1º ano do ensino médio
        "16 a 17", // 2º ano do ensino médio
        "17 a 18"  // 3º ano do ensino médio
    ];

    const validators = {
        name: [
            (v: string) => (!v ? "Nome é obrigatório" : null),
        ],
        description: [
            (v: string) => (!v ? "Descrição é obrigatório" : null),
        ],
        ageRange: [
            (v: string) => (!v ? "Faixa Etária é obrigatória" : null),
        ],

    };

    //Hook Custom 
    const {
        errors,
        touched,
        setTouched, validateField, validateForm
    } = useFormValidator(validators);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setTouched(prev => ({ ...prev, [name]: true }));

        // Valida quando sai do campo
        validateField(name as keyof typeof form, value);
    };


    // Controle do modal + reset correto
    useEffect(() => {
        if (open) {
            setMounted(true);
            const id = requestAnimationFrame(() => setAnimateIn(true));
            return () => cancelAnimationFrame(id);
        } else {
            setAnimateIn(false);
            const timer = setTimeout(() => {
                setMounted(false);
                // Reset de estado ao fechar
                setForm({
                    name: "",
                    ageRange: "",
                    description: "",
                });


            }, 300);

            return () => clearTimeout(timer);
        }
    }, [open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm(form)) {
            // Marca todos os campos como tocados
            setTouched(
                Object.keys(form).reduce((acc, key) => {
                    acc[key] = true;
                    return acc;
                }, {} as Record<string, boolean>)
            );
            return;
        }

        console.log("FORM", form)
        onSubmit({
            name: form.name,
            ageRange: form.ageRange,
            description: form.description,
        });
    };

    if (!mounted) return null;

    return (
        <div
            className={`fixed inset-0 z-50 ${animateIn ? "bg-black bg-opacity-60" : "bg-black bg-opacity-0"} transition`}
            onClick={onClose}
        >
            <div
                className={`fixed right-0 top-0 h-full bg-[#131313] min-w-[740px] border-l border-[#222630] text-white transform transition ${animateIn ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"} rounded-l-xl`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-center border-b border-gray-700 px-6 py-4">
                    <h2 className="text-white text-lg font-semibold">Criar Classe</h2>
                </div>

                <form className="flex flex-col gap-6 p-8" onSubmit={handleSubmit}>

                    {/* Nome + Idade */}
                    <div className="flex gap-4">
                        <Field label="Nome" required error={errors.name ?? undefined} touched={touched.name}>
                            <input
                                type="text"
                                className={`w-full bg-[#131516] border ${errors.name && touched.name ? "border-red-500" : "border-[#2a2e38]"} text-[#B0B7BE] px-3 py-2 rounded-md`}
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                onBlur={handleBlur}
                            />
                        </Field>

                        <Field label="Faixa Etária" required error={errors.ageRange ?? undefined} touched={touched.ageRange}  >
                            <select
                                className={`w-full bg-[#131516] border ${errors.ageRange && touched.ageRange ? "border-red-500" : "border-[#2a2e38]"} text-[#B0B7BE] px-3 py-2 rounded-md`}
                                value={form.ageRange}
                                onChange={(e) => setForm({ ...form, ageRange: e.target.value })}

                            >
                                {
                                    ageRanges.map((ages) => {
                                        return (
                                            <option value={ages}>{ages}</option>
                                        )
                                    })
                                }
                            </select>
                        </Field>
                    </div>

                    <Field
                        label="Descrição"
                        required
                        error={errors.description ?? undefined}
                        touched={touched.description}
                    >
                        <textarea
                            className={`w-full h-32 bg-[#131516] border ${errors.description && touched.description
                                ? "border-red-500"
                                : "border-[#2a2e38]"
                                } text-[#B0B7BE] px-3 py-2 rounded-md resize-none`}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            onBlur={handleBlur}
                        />
                    </Field>


                    {/* Botão */}
                    <button
                        type="submit"
                        className="bg-[#1B3F1B] hover:bg-green-700 text-green-400 px-4 py-2 rounded-2xl transition shadow-md"
                    >
                        Criar classe
                    </button>
                </form>
            </div>
        </div>
    );
};
