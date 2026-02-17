"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth, clearAuth } from "@/lib/api";
import Button from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminDashboard() {
    const router = useRouter();
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authData = getAuth();
        if (!authData || authData.role !== "admin") {
            router.push("/admin/login");
            return;
        }
        setAuth(authData);
        setLoading(false);
    }, [router]);

    const handleLogout = () => {
        clearAuth();
        router.push("/admin/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="border-b border-border bg-surface p-4">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <Skeleton variant="title" className="w-40" />
                        <Skeleton variant="button" />
                    </div>
                </div>
                <div className="max-w-6xl mx-auto p-6">
                    <Skeleton variant="title" className="mb-6" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const menuItems = [
        {
            title: "Questions",
            desc: "Create and manage MCQ questions",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
            ),
            count: "—",
            href: "#",
        },
        {
            title: "Tests",
            desc: "Create timed mock tests",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            count: "—",
            href: "#",
        },
        {
            title: "Learning Materials",
            desc: "Upload study resources",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
            ),
            count: "—",
            href: "#",
        },
        {
            title: "Packages",
            desc: "Manage subscription plans",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
            ),
            count: "—",
            href: "#",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Top Bar */}
            <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
                    <Link href="/admin/dashboard" className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold text-secondary">MockTest<span className="text-primary">Pro</span></span>
                        <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-medium">Admin</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-text-secondary hidden sm:block">
                            Welcome, <strong className="text-text-primary">{auth?.name}</strong>
                        </span>
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
                <h1 className="text-xl font-bold text-secondary mb-1">Dashboard</h1>
                <p className="text-xs text-text-secondary mb-6">Manage your mock test platform from here.</p>

                {/* Quick Actions Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {menuItems.map((item, i) => (
                        <Link
                            key={i}
                            href={item.href}
                            className="group p-4 bg-surface border border-border rounded-lg hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-9 h-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                    {item.icon}
                                </div>
                                <span className="text-lg font-bold text-text-secondary">{item.count}</span>
                            </div>
                            <h3 className="text-sm font-semibold text-secondary">{item.title}</h3>
                            <p className="text-[11px] text-text-secondary mt-0.5">{item.desc}</p>
                        </Link>
                    ))}
                </div>

                {/* Placeholder sections */}
                <div className="mt-8 p-8 bg-surface border border-border border-dashed rounded-lg text-center">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-secondary">Full Admin Panel Coming Soon</h3>
                    <p className="text-xs text-text-secondary mt-1 max-w-md mx-auto">
                        CRUD operations for Questions, Tests, Materials, and Packages will be implemented in the next phase.
                    </p>
                </div>
            </main>
        </div>
    );
}
