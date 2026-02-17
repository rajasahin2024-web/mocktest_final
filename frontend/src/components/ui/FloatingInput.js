"use client";

export default function FloatingInput({
    id,
    label,
    type = "text",
    value,
    onChange,
    error,
    required = false,
    ...props
}) {
    return (
        <div className="floating-input-wrapper mb-4">
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={label}
                required={required}
                className={`floating-input ${error ? "!border-error" : ""}`}
                {...props}
            />
            <label htmlFor={id} className="floating-label">
                {label}
                {required && <span className="text-error ml-0.5">*</span>}
            </label>
            {error && (
                <p className="text-error text-xs mt-1 ml-1">{error}</p>
            )}
        </div>
    );
}
