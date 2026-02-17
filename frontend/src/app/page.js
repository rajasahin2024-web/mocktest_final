import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-secondary">MockTest<span className="text-primary">Pro</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
              <a href="#features" className="hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
              <a href="#about" className="hover:text-primary transition-colors">About</a>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/student/login">
                <Button variant="ghost" size="sm">Student Login</Button>
              </Link>
              <Link href="/admin/login">
                <Button variant="outline" size="sm">Admin</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-secondary/[0.02]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Trusted by 10,000+ students
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary leading-tight tracking-tight">
              Ace Your Exams with
              <span className="text-primary"> Timed Mock Tests</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Practice with real-exam-like MCQ tests, track your progress with instant results,
              climb the leaderboard, and access curated learning materials — all in one platform.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/student/login">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Practicing Now
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Features
                </Button>
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in stagger-2">
            {[
              { value: "50+", label: "Mock Tests" },
              { value: "5,000+", label: "Questions" },
              { value: "10K+", label: "Students" },
              { value: "95%", label: "Satisfaction" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 bg-surface rounded-lg border border-border">
                <div className="text-xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-text-secondary mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary">Everything You Need to Succeed</h2>
            <p className="mt-3 text-text-secondary max-w-xl mx-auto">
              Our platform is designed to give you the best exam preparation experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Timed Mock Tests",
                desc: "Simulate real exam conditions with strict time limits. Auto-submission ensures a fair experience.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: "Instant Results",
                desc: "Get your score, correct answers, and detailed explanations immediately after submission.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                ),
                title: "Leaderboard",
                desc: "Compare your performance with other students. Track your rank and improvement over time.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                ),
                title: "Learning Materials",
                desc: "Access curated notes, study guides, and reference materials organized by category.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                  </svg>
                ),
                title: "Performance Analytics",
                desc: "Track your progress with detailed analytics across tests, categories, and time periods.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: "Secure & Reliable",
                desc: "Enterprise-grade security with secure payments via Razorpay and encrypted data storage.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-5 bg-background rounded-lg border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-9 h-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-semibold text-secondary">{feature.title}</h3>
                <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary">Simple, Transparent Pricing</h2>
            <p className="mt-3 text-text-secondary max-w-xl mx-auto">
              Choose a plan that fits your preparation needs. Upgrade anytime.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              {
                name: "Free",
                price: "₹0",
                period: "forever",
                features: ["5 Free Mock Tests", "Basic Results", "Limited Materials"],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Pro",
                price: "₹499",
                period: "/month",
                features: ["All Mock Tests", "Detailed Analytics", "All Learning Materials", "Leaderboard Access", "Priority Support"],
                cta: "Subscribe Now",
                popular: true,
              },
              {
                name: "Unlimited",
                price: "₹1,999",
                period: "/year",
                features: ["Everything in Pro", "1 Year Access", "Offline Downloads", "Certificate of Completion", "Personal Mentoring"],
                cta: "Best Value",
                popular: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative p-6 rounded-lg border transition-all duration-200 ${plan.popular
                    ? "border-primary bg-surface shadow-md scale-[1.02]"
                    : "border-border bg-surface hover:border-primary/30"
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-secondary-dark text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-secondary">{plan.price}</span>
                    <span className="text-xs text-text-secondary ml-1">{plan.period}</span>
                  </div>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-text-secondary">
                      <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link href="/student/login">
                    <Button
                      variant={plan.popular ? "primary" : "outline"}
                      size="md"
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary">Why MockTest Pro?</h2>
          <p className="mt-4 text-text-secondary leading-relaxed">
            MockTest Pro is built by educators who understand the challenges of exam preparation.
            Our platform combines the rigor of real exams with the convenience of online learning,
            helping thousands of students achieve their academic goals every year.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center text-left">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-secondary">Expert-Curated</h4>
                <p className="text-xs text-text-secondary mt-0.5">Questions crafted by subject matter experts</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-secondary">Always Updated</h4>
                <p className="text-xs text-text-secondary mt-0.5">New tests added regularly to match latest patterns</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-secondary text-white/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-white">MockTest<span className="text-primary-light">Pro</span></span>
            </div>
            <p className="text-xs">© 2026 MockTest Pro. All rights reserved.</p>
            <div className="flex gap-4 text-xs">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
