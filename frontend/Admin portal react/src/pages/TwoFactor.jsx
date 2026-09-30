import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import nhaaLogo from "../assets/nhaa-logo.png";

export default function TwoFactor() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const { login } = useAuth();

  let mfaData = null;

  try {
    const stored = localStorage.getItem("nhaa_mfa");
    mfaData = stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.error("MFA data error:", err);
  }

  const email = mfaData?.email || "";

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const next = [...digits];
    next[index] = value;

    setDigits(next);
    setError("");

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (
      event.key === "Backspace" &&
      !digits[index] &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const next = ["", "", "", "", "", ""];

    pasted.split("").forEach((digit, index) => {
      next[index] = digit;
    });

    setDigits(next);
    setError("");

    inputsRef.current[
      Math.min(pasted.length, 5)
    ]?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const code = digits.join("");

    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    if (!email) {
      setError("Authentication session not found. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * Prototype MFA:
       * Any six-digit code is accepted.
       */

      const user =
        mfaData?.user || {
          email,
          role: "admin",
        };

      const authData = {
        access_token: `admin-session-${Date.now()}`,
        token_type: "bearer",
        user,
      };

      // Save the session used by the Dashboard.
      localStorage.setItem(
        "nhaa_auth",
        JSON.stringify(authData)
      );

      // Update the existing AuthContext as well.
      login(user);

      // Remove temporary MFA state.
      localStorage.removeItem("nhaa_mfa");

      // Give React a moment to update AuthContext
      // before entering the protected route.
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 100);
    } catch (err) {
      console.error("MFA verification error:", err);
      setError("Verification failed. Please try again.");
      setLoading(false);
    }
  };

  if (!mfaData || !email) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-level2 p-space-xl text-center">
          <img
            src={nhaaLogo}
            alt="NHAA 14566 Official Emblem"
            className="w-14 h-14 object-contain rounded-xl ring-2 ring-slate-200 mx-auto mb-space-md"
          />

          <h1 className="text-headline-lg text-on-surface">
            Authentication Session Not Found
          </h1>

          <p className="text-body-md text-on-surface-variant mt-2 mb-space-lg">
            Please return to the login page and sign in again.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full h-10 bg-secondary hover:bg-secondary-hover text-on-secondary rounded font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-space-2xl">
      <div className="w-full max-w-md">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-level2 p-space-xl">
          <div className="flex flex-col items-center text-center mb-space-lg">
            <img
              src={nhaaLogo}
              alt="NHAA 14566 Official Emblem"
              className="w-14 h-14 object-contain rounded-xl ring-2 ring-slate-200 mb-space-md"
            />

            <h1 className="text-headline-lg text-on-surface">
              Two-Factor Verification
            </h1>

            <p className="text-body-md text-on-surface-variant mt-1">
              Enter the 6-digit verification code for{" "}
              <span className="font-medium text-on-surface">
                {email}
              </span>
              .
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-space-lg"
          >
            <div
              className="flex justify-between gap-2"
              onPaste={handlePaste}
            >
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputsRef.current[index] = element;
                  }}
                  value={digit}
                  onChange={(event) =>
                    handleChange(
                      index,
                      event.target.value
                    )
                  }
                  onKeyDown={(event) =>
                    handleKeyDown(index, event)
                  }
                  maxLength={1}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  aria-label={`Verification digit ${
                    index + 1
                  }`}
                  className="w-11 h-12 text-center text-headline-md bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />
              ))}
            </div>

            {error && (
              <p className="text-label-sm text-error flex items-center gap-1">
                <Icon name="error" size={14} />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-secondary hover:bg-secondary-hover text-on-secondary rounded font-medium text-body-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                  Verifying...
                </>
              ) : (
                "Verify & Continue"
              )}
            </button>

            <div className="flex items-center justify-between text-label-sm">
              <button
                type="button"
                onClick={() => {
                  setDigits(["", "", "", "", "", ""]);
                  setError("");
                }}
                className="text-secondary hover:underline"
              >
                Enter another code
              </button>

              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("nhaa_mfa");
                  navigate("/login");
                }}
                className="text-on-surface-variant hover:underline"
              >
                Back to login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}