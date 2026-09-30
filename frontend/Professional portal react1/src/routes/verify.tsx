import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ClipboardEvent,
} from 'react'
export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "NHAA 14566 - 2FA Identity Verification" },
      { name: "description", content: "NHAA 14566 - 2FA Identity Verification — National Atrocity Helpline & Case Intelligence System portal." },
      { property: "og:title", content: "NHAA 14566 - 2FA Identity Verification" },
      { property: "og:description", content: "NHAA 14566 - 2FA Identity Verification — National Atrocity Helpline & Case Intelligence System portal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Verify,
});

function Verify() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
const updatedOtp = ["", "", "", "", "", ""];
const [resendTimer, setResendTimer] = useState(60);
useEffect(() => {
  if (resendTimer <= 0) return;

  const timer = setInterval(() => {
    setResendTimer((previous) => previous - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [resendTimer]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpComplete = otp.every((digit) => digit !== "");

  const handleOtpChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, "");

    if (!digits) {
      const updatedOtp = [...otp];
      updatedOtp[index] = "";
      setOtp(updatedOtp);
      return;
    }

    const updatedOtp = [...otp];

    digits
      .slice(0, 6 - index)
      .split("")
      .forEach((digit, offset) => {
        updatedOtp[index + offset] = digit;
      });

    setOtp(updatedOtp);

    const nextIndex = Math.min(index + digits.length, 5);
    otpRefs.current[nextIndex]?.focus();
  };

  const handleOtpKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();

      const updatedOtp = [...otp];

      if (otp[index]) {
        updatedOtp[index] = "";
        setOtp(updatedOtp);
        return;
      }

      if (index > 0) {
        updatedOtp[index - 1] = "";
        setOtp(updatedOtp);
        otpRefs.current[index - 1]?.focus();
      }
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      otpRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      event.preventDefault();
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (
    event: ClipboardEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    const pastedOtp = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedOtp) return;

    const updatedOtp = ["", "", "", "", "", ""];
    const [resendTimer, setResendTimer] = useState(60);
    useEffect(() => {
  if (resendTimer <= 0) return;

  const timer = setInterval(() => {
    setResendTimer((previous) => previous - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [resendTimer]);
    pastedOtp.split("").forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);

    const focusIndex = Math.min(pastedOtp.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  const handleVerify = () => {
    if (!otpComplete) return;

    navigate({ to: "/dashboard" });
  };

  return (
    <div className="bg-[#F4F7FA] font-sans text-slate-800 min-h-screen flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">



      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          <div className="flex items-center space-x-4">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDiUbPOQKD-qs2W-QtVHDhHnBH3wDfurNj8EFFWCmT89iCgk3aRg11-lnvyprFrTvKJPCKszAZkIsaTsaF_6br-k71QZ6xTNVWZjjVrCWcSZnLZpJgy8zZNWBU1Fk5_gWDELJvhT_tmtJ-cOjKTfdidAqEGD00novv5MC1IT3k6_A4LMREI9SbCb3ybPlmCMu6Tson7T-Vk5wAmF7uFDHrLJpi1RX2NdgcRfouduWAukDDdlYHxJWq8IbVtmD97FlSvw" alt="Ministry of Social Justice & Empowerment" className="h-12 w-auto object-contain" />
            <div className="h-8 w-px bg-slate-300 hidden sm:block"></div>
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZUF-QtQUgylU_4u36nNEXfpfO15uOi_v_4pNkiECeYYurg4xMpkPjnv33Vva60LJo5oruJUc3W3VpF1wpJ-Robx8i-9enXUAbDc83ZmGF1wvWq-3CiFVRCJgBACep7IycJX0Plwn4xgN5UTKyUYx8fIuhOsKNRDeotta7zSOeTQBBznBrzkuwcILyCI73RMLczDOLmOJAbg5DE3FlJBYlM6LGdGr-EqjEGv4YFOgPgv6-OY7H7fug4SSVdp1EnNJYXA" alt="NHAA 14566 Helpline" className="h-10 w-auto object-contain hidden sm:block" />
          </div>


          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 text-xs font-semibold">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px]">
                <i className="fa-solid fa-check"></i>
              </span>
              <span className="text-slate-600 hidden sm:inline">Credentials</span>
              <span className="text-slate-300">&rarr;</span>
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0B2545] text-white text-[10px]">2</span>
              <span className="text-slate-900 font-bold">2FA Verification</span>
            </div>
          </div>
        </div>
      </header>


      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">


          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">


            <div className="bg-[#0B2545] p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-900/70 border border-blue-700/60 text-[11px] font-semibold tracking-wider uppercase text-blue-200">
                  <i className="fa-solid fa-shield-halved text-xs text-emerald-400"></i> Step 2 of 2: Multi-Factor Auth
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Verify Your Identity</h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                Enter the 6-digit statutory security code sent to your registered official device.
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">


              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    OTP <span className="text-red-500">*</span>
                  </label>
                </div>

                <div className="grid grid-cols-6 gap-2 sm:gap-3 my-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        otpRefs.current[index] = element;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      maxLength={6}
                      value={digit}
                      onChange={(event) =>
                        handleOtpChange(index, event.target.value)
                      }
                      onKeyDown={(event) =>
                        handleOtpKeyDown(index, event)
                      }
                      onPaste={handleOtpPaste}
                      className="w-full h-13 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-lg border-2 border-[#0B2545] bg-blue-50/40 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0B2545] shadow-xs"
                      aria-label={`OTP digit ${index + 1}`}
                    />
                  ))}
                </div>


                <div className="flex items-center justify-between text-xs mt-3 pt-1 text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <i className="fa-regular fa-clock text-slate-400"></i>
                    <span>Resend code in <span className="font-mono font-bold text-slate-800">00:{resendTimer.toString().padStart(2, "0")}</span></span>
                  </div>
                  <button
  type="button"
  disabled={resendTimer > 0}
  onClick={() => {
    setResendTimer(60);
    setOtp(["", "", "", "", "", ""]);
    otpRefs.current[0]?.focus();
  }}
  className={`font-medium ${
    resendTimer > 0
      ? "text-slate-400 cursor-not-allowed"
      : "text-[#0B2545] hover:underline cursor-pointer"
  }`}
>
  Resend Code
</button>
                </div>
              </div>

              <div>
                {otpComplete && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0">
                      <i className="fa-solid fa-check"></i>
                    </div>

                    <p className="text-xs font-bold text-emerald-900">
                      Identity Verified
                    </p>
                  </div>
                )}                </div>



              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={!otpComplete}
                  className={`w-full py-3.5 px-4 rounded-lg text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all duration-150 ${otpComplete
                    ? "bg-[#0B2545] hover:bg-[#134074] text-white hover:shadow"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                    }`}
                >
                  <i className="fa-solid fa-lock-open text-xs"></i>
                  <span>Verify & Continue to Professional Dashboard</span>
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <a href="#" className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1.5">
                  </a>
                  <a href="/" className="text-slate-500 hover:text-slate-700">
                    Back to Login
                  </a>
                </div>
              </div>

            </div>


            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
              </span>
            </div>

          </div>


          <div className="mt-4 p-3 bg-white/70 border border-slate-200 rounded-lg text-center text-xs text-slate-500">
          </div>

        </div>
      </main>


      <footer className="bg-white border-t border-slate-200 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>&copy; 2026 Ministry of Social Justice and Empowerment, Government of India.</div>
        </div>
      </footer>


    </div>
  );
}
