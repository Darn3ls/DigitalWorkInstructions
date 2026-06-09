import { useState } from "react";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("m.rossi@factory.com");
  const [password, setPassword] = useState("••••••••");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center"
              style={{ background: "var(--primary)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" fill="white" />
                <rect x="14" y="3" width="7" height="7" rx="1" fill="white" fillOpacity="0.6" />
                <rect x="3" y="14" width="7" height="7" rx="1" fill="white" fillOpacity="0.6" />
                <rect x="14" y="14" width="7" height="7" rx="1" fill="white" />
              </svg>
            </div>
            <span className="text-foreground tracking-tight" style={{ fontSize: "1.375rem", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
              WorkInstr
            </span>
          </div>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
            Digital Work Instructions Platform
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-8">
          <h1 className="text-foreground mb-1" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            Sign in to your account
          </h1>
          <p className="text-muted-foreground mb-8" style={{ fontSize: "0.875rem" }}>
            Enter your credentials to access work instructions
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-foreground mb-1.5"
                style={{ fontSize: "0.875rem", fontWeight: 500 }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-input-background text-foreground placeholder-muted-foreground outline-none transition-all"
                style={{ fontSize: "0.9375rem" }}
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-foreground mb-1.5"
                style={{ fontSize: "0.875rem", fontWeight: 500 }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-input-background text-foreground outline-none transition-all"
                style={{ fontSize: "0.9375rem" }}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div
                  className="relative w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-colors"
                  style={{
                    background: remember ? "var(--primary)" : "var(--input-background)",
                    border: remember ? "none" : "1.5px solid var(--border)",
                  }}
                  onClick={() => setRemember(!remember)}
                >
                  {remember && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-foreground" style={{ fontSize: "0.875rem" }}>
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="transition-colors"
                style={{ fontSize: "0.875rem", color: "var(--primary)", fontWeight: 500 }}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg text-white transition-all flex items-center justify-center gap-2 mt-2"
              style={{
                background: loading ? "#93c5fd" : "var(--primary)",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="40 20" />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-muted-foreground mt-8" style={{ fontSize: "0.8125rem" }}>
          © 2026 WorkInstr Inc. · v2.4.1 · ISO 9001 Certified
        </p>
      </div>
    </div>
  );
}
