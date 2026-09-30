import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { API_V1_URL } from "../../apiConfig.ts";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "NHAA 14566 - Professional Login",
      },
      {
        name: "description",
        content:
          "NHAA 14566 Professional Portal - National Atrocity Helpline & Case Intelligence System.",
      },
      {
        property: "og:title",
        content: "NHAA 14566 - Professional Login",
      },
      {
        property: "og:description",
        content:
          "NHAA 14566 Professional Portal - National Atrocity Helpline & Case Intelligence System.",
      },
      {
        property: "og:type",
        content: "website",
      },
    ],
  }),

  component: Index,
});

function Index() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!username.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      // Clear previous authentication state
      localStorage.removeItem("nhaa_auth");
      localStorage.removeItem("nhaa_mfa");

      // Authenticate with NHAA backend
      const response = await fetch(
        `${API_V1_URL}/auth/login?email=${encodeURIComponent(
          username.trim()
        )}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      let data: any = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Invalid email or password. Please check your credentials."
        );
      }

      /*
       * MFA / 2FA required
       */
      if (data.mfa_required) {
        const mfaSession = {
          email: data.user?.email || username.trim(),

          user: data.user || {
            email: username.trim(),
            role: "professional",
          },
        };

        localStorage.setItem(
          "nhaa_mfa",
          JSON.stringify(mfaSession)
        );

        const savedMfa = localStorage.getItem("nhaa_mfa");

        if (!savedMfa) {
          throw new Error(
            "Unable to create the verification session. Please try again."
          );
        }

        navigate({
          to: "/verify",
        });

        return;
      }

      /*
       * Direct token login
       */
      if (data.access_token) {
        localStorage.setItem(
          "nhaa_auth",
          JSON.stringify(data)
        );

        navigate({
          to: "/dashboard",
        });

        return;
      }

      throw new Error(
        "The authentication server returned an unexpected response."
      );
    } catch (err) {
      console.error("Professional login error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex flex-col">

      {/* ===================================================== */}
      {/* HEADER                                                */}
      {/* ===================================================== */}

     <header className="w-full h-[72px] bg-white border-b border-slate-200 shadow-sm">
  <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="h-full flex items-center justify-between gap-4">

      {/* LEFT - NHAA LOGO + WORDING */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src="nhaa-logo.png"
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
          src="ministry_logo.png"
          alt="Ministry of Social Justice and Empowerment"
          className="h-11 w-auto object-contain"
        />
      </div>

    </div>
  </div>
</header>
      {/* ===================================================== */}
      {/* MAIN CONTENT                                          */}
      {/* ===================================================== */}

      <main className="flex-1 flex items-center justify-center px-4 py-12">

        <div className="w-full max-w-md">

          <div className="bg-white border border-slate-300 rounded-xl shadow-sm p-8">

            {/* ================================================= */}
            {/* LOGIN TITLE                                       */}
            {/* ================================================= */}

            <div className="text-center mb-8">

              <h2 className="text-2xl font-bold text-slate-900">
                Professional Login
              </h2>

              <p className="text-sm text-slate-600 mt-2">
                Sign in to access the NHAA professional portal.
              </p>

            </div>


            {/* ================================================= */}
            {/* ERROR MESSAGE                                     */}
            {/* ================================================= */}

            {error && (
              <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-3">

                <p className="text-sm text-red-700 flex items-center gap-2">

                  <span className="material-symbols-outlined text-[18px]">
                    error
                  </span>

                  <span>
                    {error}
                  </span>

                </p>

              </div>
            )}


            {/* ================================================= */}
            {/* LOGIN FORM                                        */}
            {/* ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
            >

              {/* ================================================= */}
              {/* EMAIL                                             */}
              {/* ================================================= */}

              <div>

                <label
                  htmlFor="professional-email"
                  className="block text-sm font-semibold text-slate-800 mb-2"
                >
                  Email Address
                </label>

                <input
                  id="professional-email"
                  type="email"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="username"
                  disabled={loading}
                  className="w-full h-11 px-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2848B8] focus:ring-2 focus:ring-[#2848B8]/20 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />

              </div>


              {/* ================================================= */}
              {/* PASSWORD                                          */}
              {/* ================================================= */}

              <div>

                <label
                  htmlFor="professional-password"
                  className="block text-sm font-semibold text-slate-800 mb-2"
                >
                  Password
                </label>

                <div className="relative">

                  <input
                    id="professional-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full h-11 px-3 pr-11 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2848B8] focus:ring-2 focus:ring-[#2848B8]/20 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword
                        ? "visibility_off"
                        : "visibility"}
                    </span>

                  </button>

                </div>

              </div>


              {/* ================================================= */}
              {/* SIGN IN BUTTON                                    */}
              {/* ================================================= */}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#2848B8] hover:bg-[#1E3A9F] text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:bg-slate-400 disabled:text-white disabled:cursor-not-allowed"
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

                    <span className="material-symbols-outlined text-[19px]">
                      login
                    </span>

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

            {/* ================================================= */}
            {/* FOOTER                                            */}
            {/* ================================================= */}

            <div className="mt-8 pt-6 border-t border-slate-200 text-center">

              <p className="text-sm text-slate-600">
                Authorized NHAA professional access only
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}