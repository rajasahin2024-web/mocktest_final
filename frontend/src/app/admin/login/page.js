"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FloatingInput from "@/components/ui/FloatingInput";
import Button from "@/components/ui/Button";
import { apiFetch, saveAuth } from "@/lib/api";

/* ── tiny icon components ── */
const ShieldIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);
const LockIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);
const ChartIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);
const UsersIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);
const DocIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const EyeIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const EyeOffIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);
const CheckCircleIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

/* ── features list data ── */
const features = [
    { icon: ChartIcon, title: "Analytics Dashboard", desc: "Real-time test analytics and student performance tracking" },
    { icon: UsersIcon, title: "Student Management", desc: "Manage student registrations, packages and subscriptions" },
    { icon: DocIcon, title: "Test Builder", desc: "Create and organize mock tests with category-wise questions" },
    { icon: LockIcon, title: "Secure Platform", desc: "JWT-based authentication with encrypted data transmission" },
];

/* ── security badges ── */
const securityBadges = [
    "256-bit SSL Encryption",
    "JWT Authentication",
    "Bcrypt Hashed Passwords",
];

export default function AdminLoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

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
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* ═══════ LEFT PANEL — col-8 (informative / branding) ═══════ */}
            <div className="relative lg:w-2/3 w-full bg-gradient-to-br from-secondary via-secondary-dark to-[#0a1929] text-white overflow-hidden">
                {/* decorative blobs */}
                <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-accent/10 blur-2xl" />

                {/* grid dots overlay (subtle) */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
                />

                <div className="relative z-10 flex flex-col justify-between h-full px-8 py-10 lg:px-16 lg:py-14">
                    {/* top: logo */}
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2.5 group">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                                <CheckCircleIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                MockTest<span className="text-primary-light">Pro</span>
                            </span>
                        </Link>
                    </div>

                    {/* middle: headline + features */}
                    <div className="flex-1 flex flex-col justify-center py-8 lg:py-0">
                        <h1 className={`text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                            Admin Control&nbsp;Center
                        </h1>
                        <p className={`mt-3 text-white/70 text-sm lg:text-base max-w-lg leading-relaxed transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                            Manage tests, students, analytics, and the entire mock-test
                            platform from one powerful dashboard.
                        </p>

                        {/* feature cards — only visible on lg+ */}
                        <div className="hidden lg:grid grid-cols-2 gap-4 mt-10">
                            {features.map((f, i) => (
                                <div
                                    key={f.title}
                                    className={`group bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/[0.1] hover:border-white/20 transition-all duration-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                                    style={{ transitionDelay: `${200 + i * 100}ms` }}
                                >
                                    <f.icon className="w-7 h-7 text-primary-light mb-3 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-semibold text-sm">{f.title}</h3>
                                    <p className="text-xs text-white/50 mt-1 leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* feature list — visible on mobile/tablet only */}
                        <ul className="lg:hidden flex flex-wrap gap-3 mt-6">
                            {features.map((f) => (
                                <li key={f.title} className="flex items-center gap-1.5 text-xs text-white/70 bg-white/[0.08] rounded-full px-3 py-1.5">
                                    <f.icon className="w-3.5 h-3.5 text-primary-light" />
                                    {f.title}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* bottom: security badges */}
                    <div className="flex flex-wrap items-center gap-3">
                        {securityBadges.map((b) => (
                            <span key={b} className="inline-flex items-center gap-1.5 text-[11px] text-white/50 bg-white/[0.06] border border-white/10 rounded-full px-3 py-1">
                                <ShieldIcon className="w-3 h-3 text-primary-light" />
                                {b}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══════ RIGHT PANEL — col-4 (login form) ═══════ */}
            <div className="lg:w-1/3 w-full flex flex-col bg-surface">
                <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-10 xl:px-14">
                    <div className={`w-full max-w-sm transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        {/* secure badge */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <LockIcon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">Secure Access</span>
                                <p className="text-[10px] text-text-secondary -mt-0.5">Encrypted connection active</p>
                            </div>
                        </div>

                        {/* heading */}
                        <h2 className="text-2xl font-bold text-secondary mb-1">Welcome back</h2>
                        <p className="text-sm text-text-secondary mb-6">Enter your admin credentials to continue</p>

                        {/* api error */}
                        {apiError && (
                            <div className="mb-5 p-3 bg-error/5 border border-error/20 rounded-lg flex items-start gap-2 animate-fade-in">
                                <svg className="w-4 h-4 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-xs text-error">{apiError}</p>
                            </div>
                        )}

                        {/* form */}
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

                            {/* password with toggle */}
                            <div className="relative">
                                <FloatingInput
                                    id="admin-password"
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    error={errors.password}
                                    required
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-text-secondary hover:text-primary transition-colors cursor-pointer"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword
                                        ? <EyeOffIcon className="w-4 h-4" />
                                        : <EyeIcon className="w-4 h-4" />}
                                </button>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                loading={loading}
                                className="w-full mt-3"
                            >
                                {loading ? "Authenticating…" : "Sign In Securely"}
                            </Button>
                        </form>

                        {/* session info */}
                        <div className="mt-6 pt-5 border-t border-border">
                            <div className="flex items-center gap-2 text-[11px] text-text-secondary">
                                <ShieldIcon className="w-3.5 h-3.5 text-success" />
                                <span>Your session is protected with industry-standard encryption</span>
                            </div>
                        </div>

                        {/* back link */}
                        <div className="text-center mt-6">
                            <Link href="/" className="text-xs text-text-secondary hover:text-primary transition-colors inline-flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>

                {/* footer */}
                <div className="px-6 py-4 text-center border-t border-border lg:px-10">
                    <p className="text-[10px] text-text-secondary">
                        © {new Date().getFullYear()} MockTestPro. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
