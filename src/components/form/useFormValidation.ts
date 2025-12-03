import { useState } from "react";

type ValidatorFn = (value: any) => string | null;
type Validators<T> = Record<keyof T, ValidatorFn[]>;

export function useFormValidator<T extends Record<string, any>>(validators: Validators<T>) {
    const [errors, setErrors] = useState<Partial<Record<keyof T, string | null>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

    // Valida um único campo
    const validateField = (name: keyof T, value: any) => {
        const fieldValidators = validators[name] || [];
        for (const validator of fieldValidators) {
            const error = validator(value);
            if (error) {
                setErrors(prev => ({ ...prev, [name]: error }));
                return false;
            }
        }

        setErrors(prev => ({ ...prev, [name]: null }));
        return true;
    };

    // Valida todos os campos do form
    const validateForm = (form: T): boolean => {
        let isValid = true;
        const newErrors: Partial<Record<keyof T, string | null>> = {};

        for (const key in validators) {
            const value = form[key];
            const fieldValidators = validators[key] || [];

            for (const validator of fieldValidators) {
                const error = validator(value);
                if (error) {
                    isValid = false;
                    newErrors[key] = error;
                    break;
                }
            }

            if (!newErrors[key]) {
                newErrors[key] = null;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    return {
        errors,
        touched,
        setTouched,
        validateField,
        validateForm
    };
}
