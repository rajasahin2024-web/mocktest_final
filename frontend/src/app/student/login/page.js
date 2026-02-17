"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FloatingInput from "@/components/ui/FloatingInput";
import Button from "@/components/ui/Button";

export default function StudentLoginPage() {
    const router = useRouter();
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const validate = () => {
        const errs = {};
        if (isRegister && !form.name) errs.name = "Name is required";
        if (!form.email) errs.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
        if (!form.password) errs.password = "Password is required";
        else if (form.password.length < 6) errs.password = "Minimum 6 characters";
        if (isRegister && form.phone && !/^\d{10}$/.test(form.phone))
            errs.phone = "Enter a valid 10-digit phone number";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        if (!validate()) return;

        setLoading(true);
        try {
            // Student auth endpoints will be implemented in Phase 5
            setApiError("Student authentication will be available soon. This is a preview.");
        } catch {
            setApiError("Request failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
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
                    <h1 className="text-xl font-bold text-secondary">
                        {isRegister ? "Create Account" : "Student Login"}
                    </h1>
                    <p className="text-xs text-text-secondary mt-1">
                        {isRegister ? "Join and start practicing" : "Sign in to access your tests"}
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                    {apiError && (
                        <div className="mb-4 p-3 bg-accent/10 border border-accent/30 rounded-lg flex items-start gap-2">
                            <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-xs text-accent-light">{apiError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-1">
                        {isRegister && (
                            <FloatingInput
                                id="student-name"
                                label="Full Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                error={errors.name}
                                required
                            />
                        )}
                        <FloatingInput
                            id="student-email"
                            label="Email Address"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            error={errors.email}
                            required
                        />
                        {isRegister && (
                            <FloatingInput
                                id="student-phone"
                                label="Phone Number (optional)"
                                type="tel"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                error={errors.phone}
                            />
                        )}
                        <FloatingInput
                            id="student-password"
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
                            {isRegister ? "Create Account" : "Sign In"}
                        </Button>
                    </form>

                    <div className="mt-4 text-center">
                        <button
                            onClick={() => {
                                setIsRegister(!isRegister);
                                setErrors({});
                                setApiError("");
                            }}
                            className="text-xs text-primary hover:text-primary-dark transition-colors cursor-pointer"
                        >
                            {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register"}
                        </button>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <Link href="/" className="text-xs text-text-secondary hover:text-primary transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
