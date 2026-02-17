export default function Skeleton({ className = "", variant = "text" }) {
    const base = "skeleton";

    const variants = {
        text: "h-4 w-full",
        title: "h-6 w-3/4",
        avatar: "h-10 w-10 rounded-full",
        card: "h-32 w-full",
        button: "h-10 w-24",
        thumbnail: "h-48 w-full",
    };

    return (
        <div
            className={`${base} ${variants[variant] || variants.text} ${className}`}
            aria-hidden="true"
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="bg-surface rounded-lg border border-border p-5 space-y-3">
            <Skeleton variant="title" />
            <Skeleton variant="text" />
            <Skeleton variant="text" className="w-5/6" />
            <Skeleton variant="button" className="mt-2" />
        </div>
    );
}
