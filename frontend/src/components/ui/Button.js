export default function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    className = "",
    ...props
}) {
    const base =
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variants = {
        primary:
            "bg-primary text-white hover:bg-primary-dark focus:ring-primary",
        secondary:
            "bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary",
        outline:
            "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
        ghost:
            "text-text-secondary hover:bg-border/50 focus:ring-primary",
        accent:
            "bg-accent text-secondary-dark hover:bg-accent-light focus:ring-accent font-semibold",
    };

    const sizes = {
        sm: "text-sm px-3 py-1.5",
        md: "text-sm px-4 py-2.5",
        lg: "text-base px-6 py-3",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
}
