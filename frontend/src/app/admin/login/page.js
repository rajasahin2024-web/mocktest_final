"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FloatingInput from "@/components/ui/FloatingInput";
import Button from "@/components/ui/Button";
import { apiFetch, saveAuth } from "@/lib/api";

export default function AdminLoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const validate = () => {
        const errs = {};
        if (!form.email) errs.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
        if (!form.password) errs.password = "Password is required";
        else if (form.password.length < 4) errs.password = "Minimum 4 characters";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        if (!validate()) return;

        setLoading(true);
        try {
            const data = await apiFetch("/api/auth/admin/login", {
                method: "POST",
                body: JSON.stringify(form),
            });
            saveAuth(data);
            router.push("/admin/dashboard");
        } catch (err) {
            setApiError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            {/* Background pattern */}
            <div className="fixed inset-0 bg-secondary/[0.02]" />

            <div className="relative w-full max-w-sm animate-fade-in">
                {/* Header */}
                <div className="text-center mb-6">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold text-secondary">MockTest<span className="text-primary">Pro</span></span>
                    </Link>
                    <h1 className="text-xl font-bold text-secondary">Admin Login</h1>
                    <p className="text-xs text-text-secondary mt-1">Sign in to manage your mock test platform</p>
                </div>

                {/* Login Card */}
                <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                    {apiError && (
                        <div className="mb-4 p-3 bg-error/5 border border-error/20 rounded-lg flex items-start gap-2">
                            <svg className="w-4 h-4 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-xs text-error">{apiError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-1">
                        <FloatingInput
                            id="admin-email"
                            label="Email Address"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            error={errors.email}
                            required
                        />
                        <FloatingInput
                            id="admin-password"
                            label="Password"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            error={errors.password}
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            loading={loading}
                            className="w-full mt-2"
                        >
                            Sign In
                        </Button>
                    </form>
                </div>

                {/* Back link */}
                <div className="text-center mt-4">
                    <Link href="/" className="text-xs text-text-secondary hover:text-primary transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
