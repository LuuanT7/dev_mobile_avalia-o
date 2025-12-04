import { CreateUser } from "@/lib/api/users/userTypes";
import React, { useEffect, useState } from "react";
import Field from "@/components/form/Field";
import { useFormValidator } from "./form/useFormValidation";
import { fetchClassRoom } from "@/lib/api/classRoom/classRoom";
import { IClassRoom } from "@/lib/api/classRoom/classTypes";

// Importa o hook dinâmico já tipado

// 🔥 Tipo do formulário (único, não duplicar!)
export type UserFormValues = {
    name: string;
    email: string;
    age: string;
    userType: 'ADMIN' | 'STUDENTS';
    classRoomId: string;
    password: string
};

interface ModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (user: CreateUser) => void;
}

export const UserCreateModal: React.FC<ModalProps> = ({ open, onClose, onSubmit }) => {

    const [mounted, setMounted] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);
    const [classRoom, setClassRoom] = useState<IClassRoom[]>([]);


    // 🔥 Estado alinhado com UserFormValues
    const [form, setForm] = useState<UserFormValues>({
        name: "",
        email: "",
        age: "",
        userType: "STUDENTS",
        classRoomId: "",
        password: ""
    });

    const validators = {
        name: [
            (v: string) => (!v ? "Nome é obrigatório" : null),
        ],
        email: [
            (v: string) => (!v ? "Email é obrigatório" : null),
            (v: string) => (!v.includes("@") ? "Email inválido" : null),
        ],
        age: [
            (v: string) => (!v ? "Idade é obrigatória" : null),
        ],
        classRoomId: [
            (v: string) => (!v ? "Classe é obrigatória" : null),
        ],
        userType: [
            (v: string) => (!v ? "Tipo de usuário é obrigatória" : null),
        ],
        password: [
            (v: string) => (!v ? "Somente Administradores tem acesso a senha!" : null),

        ]
    };

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await fetchClassRoom();
                console.log("🚀 ~ fetchClassRoom ~ data:", data)
                if (data && Array.isArray(data)) {
                    setClassRoom(data);
                } else {
                    console.warn("⚠️ fetchClassRoom retornou dados inválidos:", data);
                    setClassRoom([]);
                }
            } catch (error) {
                console.error("❌ Erro ao buscar classes:", error);
                setClassRoom([]);
            }
        }
        fetch()

    }, []);

    //Hook Custom 
    const {
        errors,
        touched,
        setTouched, validateField, validateForm
    } = useFormValidator(validators);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setTouched(prev => ({ ...prev, [name]: true }));

        // Valida quando sai do campo
        validateField(name as keyof typeof form, value);
    };
    // const {
    //     errors,
    //     touched,
    //     validateForm,
    //     handleBlur,
    //     setErrors,
    //     setTouched,
    //     INITIAL_ERRORS,
    //     INITIAL_TOUCHED,
    // } = useFormValidation<UserFormValues>(rules);

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
                    email: "",
                    age: "",
                    userType: 'STUDENTS',
                    classRoomId: "",
                    password: ""
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
            email: form.email,
            age: form.age,
            classRoomId: form.classRoomId,
            userType: form.userType,
            password: form.password

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
                    <h2 className="text-white text-lg font-semibold">Criar usuário</h2>
                </div>

                <form className="flex flex-col gap-6 p-8" onSubmit={handleSubmit}>

                    <Field label="Senha do Adminstrador" required error={errors.password ?? undefined} touched={touched.password}>
                        <input
                            type="password"
                            className={`w-full bg-[#131516] border ${errors.name && touched.name ? "border-red-500" : "border-[#2a2e38]"} text-[#B0B7BE] px-3 py-2 rounded-md`}
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            onBlur={handleBlur}
                        />
                    </Field>

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

                        <Field label="Idade" required error={errors.age ?? undefined} touched={touched.age}  >
                            <input
                                type="text"
                                className={`w-full bg-[#131516] border ${errors.age && touched.age ? "border-red-500" : "border-[#2a2e38]"} text-[#B0B7BE] px-3 py-2 rounded-md`}
                                value={form.age}
                                onChange={(e) => setForm({ ...form, age: e.target.value })}
                                onBlur={handleBlur}
                            />
                        </Field>
                    </div>

                    {/* Email */}
                    <Field label="Email" required error={errors.email ?? undefined} touched={touched.email}>
                        <input
                            type="email"
                            className={`w-full bg-[#131516] border ${errors.email && touched.email ? "border-red-500" : "border-[#2a2e38]"} text-[#B0B7BE] px-3 py-2 rounded-md`}
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            onBlur={handleBlur}
                        />
                    </Field>

                    {/* Tipo de usuário */}
                    <Field label="Tipo do usuário" required error={errors.userType ?? undefined} touched={touched.userType}>
                        <select
                            className={`w-full bg-[#131516] border ${errors.userType && touched.userType ? "border-red-500" : "border-[#2a2e38]"} text-[#B0B7BE] px-3 py-2 rounded-md`}
                            value={form.userType || ""}
                            onChange={(e) => {
                                const value = e.target.value as "ADMIN" | "STUDENTS";
                                setForm({ ...form, userType: value });
                            }}
                        >
                            <option value="" disabled>Selecione o tipo do usuário</option>
                            <option value="STUDENTS">Estudante</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                    </Field>

                    {/* Classe */}
                    <Field label="Classe" required error={errors.classRoomId ?? undefined} touched={touched.classRoomId}>
                        <select
                            name="classRoomId"
                            value={form.classRoomId || ""}
                            onChange={(e) => {
                                setForm({ ...form, classRoomId: e.target.value });
                            }}
                            onBlur={(e) => {
                                const { name, value } = e.target;
                                setTouched(prev => ({ ...prev, [name]: true }));
                                validateField(name as keyof typeof form, value);
                            }}
                            className={`w-full bg-[#131516] border ${errors.classRoomId && touched.classRoomId ? "border-red-500" : "border-[#2a2e38]"} text-[#B0B7BE] px-3 py-2 rounded-md`}
                        >
                            <option value="" disabled>Selecione uma classe</option>
                            {
                                classRoom?.map((room) => {
                                    return (
                                        <option key={room.id} value={room.id}>{room.name}</option>
                                    )
                                })
                            }

                        </select>
                    </Field>

                    {/* Botão */}
                    <button
                        type="submit"
                        className="bg-[#1B3F1B] hover:bg-green-700 text-green-400 px-4 py-2 rounded-2xl transition shadow-md"
                    >
                        Criar usuário
                    </button>
                </form>
            </div>
        </div>
    );
};
