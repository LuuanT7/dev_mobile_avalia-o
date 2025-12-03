import React from "react";

interface FieldProps {
    label: string;
    required?: boolean;
    error?: string;
    touched?: boolean;
    children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({ label, required, error, touched, children }) => {
    return (
        <div className="w-full">
            <label className="block mb-1 text-xs text-gray-400">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {error && touched && (
                <span className="text-xs text-red-500 mt-1 block">{error}</span>
            )}
        </div>
    );
};

export default Field;

