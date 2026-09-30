import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import nhaaLogo from "../assets/nhaa-logo.png";
import ministryLogo from "../assets/ministry-logo.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!username.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      localStorage.removeItem("nhaa_auth");
      localStorage.removeItem("nhaa_mfa");

      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/auth/login?email=${encodeURIComponent(
          username.trim()
        )}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.detail || "Invalid email or password."
        );
      }

      if (!data.access_token) {
        throw new Error(
          "Login succeeded but no access token was returned."
        );
      }

      // Store the complete backend authentication response.
      localStorage.setItem(
        "nhaa_auth",
        JSON.stringify(data)
      );

      // Synchronize AuthContext.
      login(data);

      // Go directly to the Admin dashboard.
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Admin login error:", err);

      setError(
        err.message ||
        "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="w-full h-[72px] bg-white border-b border-slate-200 shadow-sm">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-full flex items-center justify-between gap-4">

            {/* LEFT - NHAA LOGO + WORDING */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src="src\assets\nhaa-logo.png"
                alt="NHAA 14566 - National Atrocity Helpline"
                className="h-10 w-auto object-contain shrink-0"
              />

              <div className="leading-tight">
                <div className="text-lg font-semibold text-slate-900">
                  NHAA 14566
                </div>

                <div className="text-sm text-slate-500">
                  National Atrocity Helpline
                </div>
              </div>
            </div>

            {/* RIGHT - MINISTRY LOGO */}
            <div className="flex items-center shrink-0">
              <img
                src="src\assets\ministry-logo.png"
                alt="Ministry of Social Justice and Empowerment"
                className="h-11 w-auto object-contain"
              />
            </div>

          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-level2 p-space-xl">
            <div className="text-center mb-space-xl">
              <h2 className="text-headline-lg text-on-surface">
                Administrator Login
              </h2>

              <p className="text-body-md text-on-surface-variant mt-2">
                Sign in to access the NHAA administration portal.
              </p>
            </div>

            {error && (
              <div className="mb-space-lg rounded-lg border border-error/30 bg-error/5 p-3">
                <p className="text-label-sm text-error flex items-start gap-2">
                  <Icon name="error" size={16} />
                  <span>{error}</span>
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-space-lg"
            >
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-label-md text-on-surface mb-2"
                >
                  Email Address
                </label>

                <input
                  id="admin-email"
                  type="email"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="username"
                  disabled={loading}
                  className="w-full h-11 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-label-md text-on-surface mb-2"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full h-11 px-3 pr-11 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    <Icon
                      name={
                        showPassword
                          ? "visibility_off"
                          : "visibility"
                      }
                      size={20}
                    />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-secondary hover:bg-secondary-hover text-on-secondary rounded-lg font-medium text-body-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
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
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>

                    Signing in...
                  </>
                ) : (
                  <>
                    <Icon name="login" size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>


            {/* BACK TO LANDING PAGE */}
            <div className="mt-5 text-center">
              <a
                href="/newchatbot.html"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0B2545] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  arrow_back
                </span>
                Back to Landing Page
              </a>
            </div>


            <div className="mt-space-xl pt-space-lg border-t border-outline-variant text-center">
              <p className="text-label-sm text-on-surface-variant">
                Authorized NHAA administrative access only
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}