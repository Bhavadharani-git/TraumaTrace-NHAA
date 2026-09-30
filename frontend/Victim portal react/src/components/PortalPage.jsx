import { useEffect, useState } from "react";

import {
  showAuthMode,
  notify,
  navStep,
  refreshStepVisibility,
  switchTab,
  validateConsentAndProceed,
  selectLanguage,
  confirmLanguageAndProceed,
  confirmCommModeAndProceed,
  setCommMode,
  updateCharCount,
  toggleRecordingUI,
  submitComplaintAndTriggerAI,
  loadMyComplaints,
  getComplaintStage,
  analyzeComplaintWithSVI,
  openModal,
  closeModal,
  initPortal,
  handleBackdropClick,
} from "../portalController";

export default function PortalPage() {
  const [myComplaints, setMyComplaints] = useState([]);
  const [sviResult, setSviResult] = useState(null);
  const [lastComplaint, setLastComplaint] = useState({});
  const [consentRecorded, setConsentRecorded] = useState(false);

  useEffect(() => {
    initPortal();

    const refreshStoredData = () => {
      // -----------------------------
      // Load SVI result
      // -----------------------------
      const savedSVI =
        localStorage.getItem("nhaa_svi_result");

      if (savedSVI) {
        try {
          setSviResult(JSON.parse(savedSVI));
        } catch (error) {
          console.error(
            "Invalid saved SVI result:",
            error
          );
        }
      }

      // -----------------------------
      // Load latest complaint
      // -----------------------------
      const savedComplaint =
        localStorage.getItem(
          "nhaa_last_complaint"
        );

      if (savedComplaint) {
        try {
          setLastComplaint(
            JSON.parse(savedComplaint)
          );
        } catch (error) {
          console.error(
            "Invalid saved complaint:",
            error
          );
        }
      }

      // -----------------------------
      // Load consent state
      // -----------------------------
      const consentOne =
        document.getElementById(
          "consent-chk-1"
        )?.checked;

      const consentTwo =
        document.getElementById(
          "consent-chk-2"
        )?.checked;

      setConsentRecorded(
        Boolean(
          consentOne && consentTwo
        )
      );
    };

    refreshStoredData();

    // The controller updates localStorage
    // in the same browser tab. React does not
    // automatically re-render for that change.
    const intervalId = setInterval(
      refreshStoredData,
      250
    );

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  const getComplaintStage = (status) => {
    const stages = [
      "received",
      "under_assessment",
      "support_recommended",
      "under_review",
      "action_in_progress",
      "resolved",
    ];

    const currentIndex = stages.indexOf(status);

    return currentIndex >= 0 ? currentIndex : 0;
  };
  async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("login-user")?.value.trim();
    const password = document.getElementById("login-pass")?.value;

    if (!email || !password) {
      notify("Please enter your email and password.");
      return;
    }

    try {
      const params = new URLSearchParams({
        email,
        password,
      });

      const response = await fetch(
        `http://10.171.161.250:8000/api/v1/auth/login?${params.toString()}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        notify(data.detail || "Login failed. Please check your credentials.");
        return;
      }

      localStorage.setItem("nhaa_auth", JSON.stringify(data));

      notify("Login successful.");

      setTimeout(() => {
        switchTab(3);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 300);

    } catch (error) {
      console.error("Login error:", error);
      notify("Unable to connect to the NHAA backend.");
    }

  }

  async function handleSignup(event) {
    event.preventDefault();

    const fullName = document.getElementById("reg-name")?.value.trim();
    const email = document.getElementById("reg-email")?.value.trim();
    const password = document.getElementById("reg-pass")?.value;
    const confirmPassword = document.getElementById("reg-cpass")?.value;

    if (!fullName || !email || !password || !confirmPassword) {
      notify("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      notify("Passwords do not match.");
      return;
    }

    try {
      const params = new URLSearchParams({
        full_name: fullName,
        email: email,
        password: password,
      });

      const response = await fetch(
        `http://10.171.161.250:8000/api/v1/auth/register?${params.toString()}`, {
        method: "POST",
      }
      );

      const data = await response.json();

      if (!response.ok) {
        notify(data.detail || "Registration failed.");
        return;
      }

      notify("Account created successfully.");

      switchTab(3);
    } catch (error) {
      console.error("Signup error:", error);
      notify("Unable to connect to the NHAA server.");
    }
  }


  return (
    <div>
      {/* BEGIN: MinimalVictimHeader */}
      <header className="w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between gap-4">

            {/* LEFT - NHAA LOGO + WORDING */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src="/nhaa-logo.png"
                alt="NHAA 14566 - National Atrocity Helpline"
                className="h-10 sm:h-11 md:h-12 w-auto object-contain shrink-0"
              />

              <div className="leading-tight">
                <div className="text-lg sm:text-xl font-semibold text-slate-900">
                  NHAA 14566
                </div>
                <div className="text-sm sm:text-base text-slate-500">
                  National Atrocity Helpline
                </div>
              </div>
            </div>

            {/* RIGHT - MINISTRY LOGO ONLY */}
            <div className="flex items-center shrink-0">
              <img
                src="/ministry-logo.jpeg"
                alt="Ministry of Social Justice and Empowerment, Government of India"
                className="h-10 sm:h-12 md:h-14 w-auto object-contain"
              />
            </div>

          </div>
        </div>
      </header>
      {/* END: MinimalVictimHeader */}
      {/* BEGIN: MainContentWrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6" data-purpose="tab-container" id="main-content">
        {/* ========================================== */}
        {/* TAB 1: MINIMAL VICTIM LOGIN */}
        {/* ========================================== */}
        <section
          className="tab-panel min-h-[calc(100vh-80px)] flex items-center justify-center py-8 sm:py-12"
          data-purpose="victim-login-screen"
          id="tab-panel-1"
        >
          <div className="w-full max-w-md mx-auto px-1 sm:px-0">

            {/* Minimal Login Gateway */}
            <div
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8"
              id="auth-login-view"
            >
              <div>

                <div className="text-center mb-7">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Citizen Login
                  </h2>

                  <p className="text-sm text-slate-500 mt-2">
                    Sign in to access the NHAA citizen support portal.
                  </p>
                </div>

                {/* Existing backend-connected login handler is preserved */}
                <form className="space-y-5" onSubmit={handleLogin}>
                  <div>
                    <label
                      className="block text-sm font-semibold text-slate-700 mb-2"
                      htmlFor="login-user"
                    >
                      Username, Email, or Mobile
                    </label>

                    <input
                      className="w-full h-11 px-3.5 text-sm border border-slate-300
                                 rounded-lg bg-white text-slate-900
                                 focus:ring-2 focus:ring-blue-100
                                 focus:border-blue-600 focus:outline-none"
                      id="login-user"
                      type="text"
                      autoComplete="username"
                      placeholder="Enter your username, email, or mobile number"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2 gap-2">
                      <label
                        className="text-sm font-semibold text-slate-700"
                        htmlFor="login-pass"
                      >
                        Password
                      </label>

                      <a
                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        href="#forgot-password"
                        onClick={(event) => {
                          event.preventDefault();
                          notify("Password reset instructions will be sent to your registered contact.");
                        }}
                      >
                        Forgot password?
                      </a>
                    </div>

                    <div className="relative">
                      <input
                        className="w-full h-11 px-3.5 pr-14 text-sm border border-slate-300
                                   rounded-lg bg-white text-slate-900
                                   focus:ring-2 focus:ring-blue-100
                                   focus:border-blue-600 focus:outline-none"
                        id="login-pass"
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                      />

                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2
                                   text-xs sm:text-sm text-slate-400 hover:text-slate-600"
                        onClick={(event) => {
                          const p = document.getElementById("login-pass");
                          if (p) {
                            p.type = p.type === "password" ? "text" : "password";
                          }
                        }}
                        type="button"
                      >
                        Show
                      </button>
                    </div>
                  </div>

                  <button
                    className="w-full h-11 bg-[#2F4DBD] hover:bg-[#2742A5]
             active:bg-[#21398F] text-white rounded-lg
             font-bold text-sm sm:text-base shadow-sm transition
             flex items-center justify-center gap-2"
                    type="submit"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M10 17l5-5-5-5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                      />
                      <path
                        d="M15 12H3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                      />
                      <path
                        d="M21 4v16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                      />
                    </svg>

                    <span>Sign In</span>
                  </button>
                </form>

                <div className="mt-6 text-center text-xs sm:text-sm text-slate-600">
                  Do not have a support account?
                  <button
                    className="text-blue-600 font-bold hover:underline ml-1"
                    onClick={(event) => {
                      showAuthMode("signup");
                    }}
                    type="button"
                  >
                    Create Account
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                  <button
                    className="text-xs sm:text-sm font-semibold text-rose-600
                               hover:text-rose-700 inline-flex items-center justify-center
                               gap-1"
                    onClick={(event) => {
                      openModal("emergencyModal");
                    }}
                    type="button"
                  >
                    <span aria-hidden="true">⚠</span>
                    <span>In danger right now? Access Immediate Crisis Reliever</span>
                  </button>
                </div>

              </div>
            </div>
            <div className="mt-5 text-center">
              <a
                href="/newchatbot.html"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0B2545] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </svg>

                <span>Back to Landing Page</span>
              </a>
            </div>

            {/* Signup view (same page as login) */}
            <div className="hidden" id="auth-signup-view">
              <div className="w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-center mb-6">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Simple Non-Intimidating Form</span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">Create Your Support Account</h2>
                  <p className="text-xs text-slate-500 mt-1">Your identity is protected under government safety protocols. Anonymized aliases are accepted.</p>
                </div>
                <form className="space-y-4" onSubmit={handleSignup}>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="reg-name">Full Name (or Preferred Alias)</label>
                    <input className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" id="reg-name" placeholder="e.g., Rajesh Kumar or Anonymous" type="text" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="reg-user">Username</label>
                      <input className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" id="reg-user" placeholder="rajesh_secure" type="text" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="reg-phone">Mobile (For OTP &amp; Follow-up)</label>
                      <input className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" id="reg-phone" placeholder="98XXXXXXXX" type="tel" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="reg-email">Email Address (Optional)</label>
                    <input className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" id="reg-email" placeholder="help@securemail.gov" type="email" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="reg-pass">Create Password</label>
                      <input className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" id="reg-pass" placeholder="••••••••" type="password" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="reg-cpass">Confirm Password</label>
                      <input className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" id="reg-cpass" placeholder="••••••••" type="password" />
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center space-x-2">
                    <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                    <span>Your registration creates an encrypted docket reference for ongoing case monitoring.</span>
                  </div>
                  <button
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow transition"
                    type="submit"
                  >
                    Create Support Account & Continue
                  </button>
                </form>
                <div className="mt-6 text-center text-xs text-slate-600">
                  Already registered?
                  <button className="text-blue-600 font-bold hover:underline ml-1" onClick={(event) => { showAuthMode('login') }}>Log In Here</button>
                </div>
              </div>
            </div>


          </div>
        </section>
        {/* ========================================== */}
        {/* TAB 3: TERMS & CONSENT */}
        {/* ========================================== */}
        <section className="tab-panel hidden" data-purpose="terms-and-consent-screen" id="tab-panel-3">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="mb-6">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Step 3 of Intake Workflow</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Informed Consent &amp; Data Transparency</h2>
              <p className="text-xs text-slate-500 mt-1">Please read how your statement is processed to ensure rapid safety, psychological comfort, and legal prioritization.</p>
            </div>
            {/* 5 Essential Information Cards */}
            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                <h4 className="font-bold text-sm text-blue-950 flex items-center space-x-2">
                  <span className="p-1 bg-blue-600 text-white rounded text-xs">1</span>
                  <span>How Your Information Is Used</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed pl-6">
                  Details provided will be used exclusively to assess your distress level, formulate an initial safety index, and dispatch assistance through the NHAA caseworker unit.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
                <h4 className="font-bold text-sm text-amber-900 flex items-center space-x-2">
                  <span className="p-1 bg-amber-600 text-white rounded text-xs">2</span>
                  <span>AI-Assisted Screening (Non-Diagnostic)</span>
                </h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed pl-6 font-medium">
                  Important: The Artificial Intelligence module assists solely in identifying support-related vulnerability indicators (SVI). It does NOT provide a medical diagnosis or replace licensed psychiatric care.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50">
                <h4 className="font-bold text-sm text-emerald-950 flex items-center space-x-2">
                  <span className="p-1 bg-emerald-600 text-white rounded text-xs">3</span>
                  <span>Human Oversight Guarantee</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed pl-6">
                  No automatic punitive or final decisions are made by AI. A qualified human caseworker and psychological officer verify every generated priority before formal escalation.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                  <span className="p-1 bg-slate-700 text-white rounded text-xs">4</span>
                  <span>Data Privacy &amp; Anonymity</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed pl-6">
                  All communications are encrypted using Government of India data protection standards. You may choose to mask your personal identifiers at any point.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/60">
                <h4 className="font-bold text-sm text-rose-950 flex items-center space-x-2">
                  <span className="p-1 bg-rose-600 text-white rounded text-xs">5</span>
                  <span>Emergency Support Exemption</span>
                </h4>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed pl-6 font-medium">
                  If at any moment you indicate active danger or self-harm risk, emergency dispatch protocols can immediately connect you to 14566 or 112 emergency services.
                </p>
              </div>
            </div>
            {/* Checkboxes */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input className="mt-1 rounded text-blue-600 focus:ring-blue-500" id="consent-chk-1" type="checkbox" />
                <span className="text-xs text-slate-700">I understand that AI is utilized for priority screening and triage, not medical diagnosis.</span>
              </label>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input className="mt-1 rounded text-blue-600 focus:ring-blue-500" id="consent-chk-2" type="checkbox" />
                <span className="text-xs text-slate-700">I consent to human caseworkers reviewing my trauma indicators to coordinate relief under PoA provisions.</span>
              </label>
            </div>
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100" onClick={(event) => { switchTab(1) }}>
                Back
              </button>
              <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow flex items-center space-x-2" onClick={(event) => { validateConsentAndProceed() }}>
                <span>Agree &amp; Continue</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
              </button>
            </div>
          </div>
        </section>
        {/* ========================================== */}
        {/* TAB 4: LANGUAGE SELECTION */}
        {/* ========================================== */}
        <section className="tab-panel hidden" data-purpose="multilingual-selection-screen" id="tab-panel-4">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase">Multilingual Accessibility</span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">Which language would you like to use?</h2>
              <p className="text-xs text-slate-500 mt-1">Select your preferred regional language. You can speak or write comfortably in any of the following:</p>
            </div>
            {/* Language Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              <button className="lang-card p-4 rounded-xl border-2 border-blue-600 bg-blue-50/50 text-left transition hover:shadow-md" onClick={(event) => { selectLanguage(event.currentTarget, 'English') }}>
                <span className="text-base font-bold text-slate-900 block">English</span>
                <span className="text-xs text-slate-500">Official Default</span>
              </button>
              <button className="lang-card p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white text-left transition hover:shadow-md" onClick={(event) => { selectLanguage(event.currentTarget, 'Tamil') }}>
                <span className="text-base font-bold text-slate-900 block">தமிழ்</span>
                <span className="text-xs text-slate-500">Tamil</span>
              </button>
              <button className="lang-card p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white text-left transition hover:shadow-md" onClick={(event) => { selectLanguage(event.currentTarget, 'Hindi') }}>
                <span className="text-base font-bold text-slate-900 block">हिन्दी</span>
                <span className="text-xs text-slate-500">Hindi</span>
              </button>
              <button className="lang-card p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white text-left transition hover:shadow-md" onClick={(event) => { selectLanguage(event.currentTarget, 'Telugu') }}>
                <span className="text-base font-bold text-slate-900 block">తెలుగు</span>
                <span className="text-xs text-slate-500">Telugu</span>
              </button>
              <button className="lang-card p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white text-left transition hover:shadow-md" onClick={(event) => { selectLanguage(event.currentTarget, 'Kannada') }}>
                <span className="text-base font-bold text-slate-900 block">ಕನ್ನಡ</span>
                <span className="text-xs text-slate-500">Kannada</span>
              </button>
              <button className="lang-card p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white text-left transition hover:shadow-md" onClick={(event) => { selectLanguage(event.currentTarget, 'Malayalam') }}>
                <span className="text-base font-bold text-slate-900 block">മലയാളം</span>
                <span className="text-xs text-slate-500">Malayalam</span>
              </button>
              <button className="lang-card p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white text-left transition hover:shadow-md" onClick={(event) => { selectLanguage(event.currentTarget, 'Bengali') }}>
                <span className="text-base font-bold text-slate-900 block">বাংলা</span>
                <span className="text-xs text-slate-500">Bengali</span>
              </button>
              <button className="lang-card p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white text-left transition hover:shadow-md" onClick={(event) => { selectLanguage(event.currentTarget, 'Marathi') }}>
                <span className="text-base font-bold text-slate-900 block">मराठी</span>
                <span className="text-xs text-slate-500">Marathi</span>
              </button>
              <button className="lang-card p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white text-left transition hover:shadow-md" onClick={(event) => { selectLanguage(event.currentTarget, 'Gujarati') }}>
                <span className="text-base font-bold text-slate-900 block">ગુજરાતી</span>
                <span className="text-xs text-slate-500">Gujarati</span>
              </button>
              <button className="lang-card p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white text-left transition hover:shadow-md" onClick={(event) => { selectLanguage(event.currentTarget, 'Punjabi') }}>
                <span className="text-base font-bold text-slate-900 block">ਪੰਜਾਬੀ</span>
                <span className="text-xs text-slate-500">Punjabi</span>
              </button>
              <button className="lang-card p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white text-left transition hover:shadow-md" onClick={(event) => { selectLanguage(event.currentTarget, 'Odia') }}>
                <span className="text-base font-bold text-slate-900 block">ଓଡ଼ିଆ</span>
                <span className="text-xs text-slate-500">Odia</span>
              </button>
              <button className="lang-card p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white text-left transition hover:shadow-md" onClick={(event) => { selectLanguage(event.currentTarget, 'Urdu') }}>
                <span className="text-base font-bold text-slate-900 block">اردو</span>
                <span className="text-xs text-slate-500">Urdu</span>
              </button>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100" onClick={(event) => { switchTab(3) }}>
                Back
              </button>
              <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow flex items-center space-x-2" onClick={(event) => { confirmLanguageAndProceed() }}>
                <span>Confirm Language &amp; Continue</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
              </button>
            </div>
          </div>
        </section>
        {/* ========================================== */}
        {/* TAB 5: COMMUNICATION PREFERENCE */}
        {/* ========================================== */}
        <section className="tab-panel hidden" data-purpose="comm-mode-selection" id="tab-panel-5">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase">Accessibility Choice</span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">How would you prefer to communicate?</h2>
              <p className="text-xs text-slate-500 mt-1">Select the format you feel safest and most comfortable expressing yourself.</p>
            </div>
            {/* 3 Communication Mode Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="cursor-pointer border-2 border-blue-600 bg-blue-50/50 p-6 rounded-2xl text-center transition hover:shadow-md flex flex-col items-center justify-between" id="mode-opt-text" onClick={(event) => { setCommMode('text') }}>
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 shadow">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                  </div>
                  <h4 className="font-bold text-base text-slate-900">Type Complaint</h4>
                  <p className="text-xs text-slate-500 mt-2">Write down your experience privately at your own speed with guidance.</p>
                </div>
                <span id="mode-status-text" className="mt-4 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Available
                </span>
              </div>
              <div className="cursor-pointer border-2 border-slate-200 hover:border-blue-400 bg-white p-6 rounded-2xl text-center transition hover:shadow-md flex flex-col items-center justify-between" id="mode-opt-voice" onClick={(event) => { setCommMode('voice') }}>
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                  </div>
                  <h4 className="font-bold text-base text-slate-900">Voice Note / Audio</h4>
                  <p className="text-xs text-slate-500 mt-2">Speak directly into the browser. AI transcribes and screens simultaneously.</p>
                </div>
                <span id="mode-status-voice" className="mt-4 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Available
                </span>
              </div>
              <div className="cursor-pointer border-2 border-slate-200 hover:border-blue-400 bg-white p-6 rounded-2xl text-center transition hover:shadow-md flex flex-col items-center justify-between" id="mode-opt-ivrs" onClick={(event) => { setCommMode('ivrs') }}>
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                  </div>
                  <h4 className="font-bold text-base text-slate-900">IVRS Phone Call</h4>
                  <p className="text-xs text-slate-500 mt-2">Receive an immediate automated callback on your phone to narrate verbally.</p>
                </div>
                <span id="mode-status-ivrs" className="mt-4 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Available
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100" onClick={(event) => { switchTab(4) }}>
                Back
              </button>
              <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow flex items-center space-x-2" onClick={(event) => { confirmCommModeAndProceed() }}>
                <span>Proceed to Complaint Intake</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
              </button>
            </div>
          </div>
        </section>
        {/* ========================================== */}
        {/* TAB 6: COMPLAINT INPUT (Text / Voice / IVRS) */}
        {/* ========================================== */}
        <section className="tab-panel hidden" data-purpose="complaint-input-intake" id="tab-panel-6">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            {/* Mode Switcher Tabs Inside Step 6 */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Tell Us What Happened</h2>
                <p className="text-xs text-slate-500">Take your time. You are in a safe, protected environment.</p>
              </div>
              <div className="flex p-1 bg-slate-100 rounded-lg text-xs font-semibold">
                <button className="px-3 py-1.5 rounded-md bg-white text-blue-700 shadow-xs" id="subnav-text" onClick={(event) => { setCommMode('text') }}>Text</button>
                <button className="px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900" id="subnav-voice" onClick={(event) => { setCommMode('voice') }}>Voice</button>
                <button className="px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900" id="subnav-ivrs" onClick={(event) => { setCommMode('ivrs') }}>IVRS Call</button>
              </div>
            </div>
            {/* MODE 1: TEXT FORM */}
            <div className="space-y-4" id="input-container-text">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-700" htmlFor="complaint-text">Describe the Incident, Location &amp; Harassment Details</label>
                  <span className="text-[11px] text-slate-400 font-mono" id="char-counter">
                    0 / 2000 chars
                  </span>                </div>
                <textarea className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none leading-relaxed text-slate-800" id="complaint-text" onInput={(event) => { updateCharCount(event.currentTarget) }} placeholder="Please describe what occurred, dates, persons involved, threats received, or physical/verbal abuse faced..." rows={7} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="incident-dist">Incident District / State</label>
                  <input
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    id="incident-dist"
                    type="text"
                    placeholder="Enter district and state"
                  />                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="incident-date">Date of Occurrence</label>
                  <input className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" id="incident-date" type="date" />
                </div>
              </div>
            </div>
            {/* MODE 2: VOICE RECORDING */}
            <div className="hidden space-y-6 text-center py-6" id="input-container-voice">
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-100 rounded-full pulse-ring" />
                <button className="relative z-10 w-20 h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition" id="voice-rec-btn" onClick={(event) => { toggleRecordingUI() }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                </button>
              </div>
              <div>
                <span className="text-sm font-bold text-slate-800" id="rec-status">Ready to listen... Press the mic to record</span>
                <div className="text-xs text-slate-500 font-mono mt-1" id="rec-timer">00:00 / 05:00</div>
              </div>
              {/* Animated Simulated Waveform */}
              <div className="flex items-center justify-center space-x-1.5 h-12 bg-slate-50 rounded-xl p-3 border border-slate-200 max-w-md mx-auto">
                <div className="w-1.5 bg-blue-500 rounded-full waveform-bar" style={{ animationDelay: '0.1s' }} />
                <div className="w-1.5 bg-blue-600 rounded-full waveform-bar" style={{ animationDelay: '0.3s' }} />
                <div className="w-1.5 bg-indigo-500 rounded-full waveform-bar" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 bg-blue-400 rounded-full waveform-bar" style={{ animationDelay: '0.5s' }} />
                <div className="w-1.5 bg-blue-600 rounded-full waveform-bar" style={{ animationDelay: '0.15s' }} />
                <div className="w-1.5 bg-indigo-600 rounded-full waveform-bar" style={{ animationDelay: '0.4s' }} />
                <div className="w-1.5 bg-blue-500 rounded-full waveform-bar" style={{ animationDelay: '0.25s' }} />
                <div className="w-1.5 bg-blue-400 rounded-full waveform-bar" style={{ animationDelay: '0.35s' }} />
              </div>
              <div className="text-left bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-lg mx-auto">
                <span className="text-[11px] font-bold uppercase text-slate-500 block mb-1">Live Speech-To-Text Preview:</span>
                <p className="text-xs text-slate-700 italic">Listening...</p>
              </div>
            </div>
            {/* MODE 3: IVRS CALL WORKFLOW */}
            <div className="hidden space-y-6 py-4" id="input-container-ivrs">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">

                {/* Phone Icon */}
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>

                {/* IVRS Heading */}
                <h3 className="font-bold text-base text-blue-950">
                  Call 14566 to Report Your Incident
                </h3>

                <p className="text-xs text-blue-800 mt-1 max-w-md mx-auto">
                  Initiate a call to the NHAA 14566 helpline using your verified phone
                  number. Once connected, you can narrate your incident through the
                  secure IVRS service.
                </p>

                {/* Call Button */}
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition-colors"
                    onClick={() => {
                      notify("Initiating call to NHAA 14566...");
                    }}
                  >
                    Call 14566
                  </button>
                </div>
              </div>

              {/* IVRS Flow Steps */}
              <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-medium">

                {/* Step 1 */}
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                  <span className="block font-bold">
                    1. Call 14566
                  </span>
                  <span className="text-[10px] text-blue-600">
                    You initiate the call
                  </span>
                </div>

                {/* Step 2 */}
                <div className="p-2.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200">
                  <span className="block font-bold">
                    2. Connect
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Secure IVRS line
                  </span>
                </div>

                {/* Step 3 */}
                <div className="p-2.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200">
                  <span className="block font-bold">
                    3. Speak Freely
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Incident captured
                  </span>
                </div>

                {/* Step 4 */}
                <div className="p-2.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200">
                  <span className="block font-bold">
                    4. AI Screening
                  </span>
                  <span className="text-[10px] text-slate-500">
                    SVI indexing
                  </span>
                </div>
              </div>
            </div>

            {/* Submission and Navigation */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">

              {/* Back Button */}
              <button
                type="button"
                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100"
                onClick={() => {
                  switchTab(5);
                }}
              >
                Back
              </button>

              {/* Continue Button */}
              <button
                type="button"
                className="px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow flex items-center space-x-2"
                onClick={async () => {
                  await submitComplaintAndTriggerAI();
                }}
              >
                <span>Continue to Screening</span>

                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13 5l7 7m0 0l-7 7m7-7H3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
        {/* ========================================== */}
        {/* TAB 7: COMPLAINT RECEIVED */}
        {/* ========================================== */}
        <section className="tab-panel hidden" data-purpose="complaint-ack-screen" id="tab-panel-7">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase">Official Acknowledgment</span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">Complaint Formally Registered</h2>
            <p className="text-xs text-slate-500 mt-1">Your case has been sealed and submitted to the National Helpline Against Atrocities network.</p>
            {/* Reference Docket ID Card */}
            <div className="my-6 bg-slate-50 border border-slate-200 rounded-xl p-5 max-w-md mx-auto text-left">

              <div className="flex justify-between items-center pb-3 border-b border-slate-200">

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Reference Number
                  </span>

                  <div className="text-lg font-mono font-bold text-blue-700">
                    {lastComplaint.complaint_id || "Pending"}
                  </div>
                </div>

                <button
                  className="text-xs text-blue-600 font-semibold hover:underline"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      lastComplaint.complaint_id || ""
                    );

                    notify("Reference ID copied!");
                  }}
                >
                  Copy
                </button>

              </div>

              <div className="pt-3 text-xs space-y-1.5 text-slate-600">

                {/* Timestamp */}
                <div className="flex justify-between">

                  <span className="text-slate-400">
                    Timestamp:
                  </span>

                  <span className="font-medium text-slate-800">

                    {lastComplaint.created_at
                      ? new Date(
                        lastComplaint.created_at
                      ).toLocaleString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                          timeZone: "Asia/Kolkata",
                        }
                      ) + " IST"
                      : "Pending"}

                  </span>

                </div>

                {/* Jurisdiction */}
                <div className="flex justify-between">

                  <span className="text-slate-400">
                    Jurisdiction:
                  </span>

                  <span className="font-medium text-slate-800">
                    {lastComplaint.incident_district ||
                      "Pending"}
                  </span>

                </div>

                {/* Privacy */}
                <div className="flex justify-between">

                  <span className="text-slate-400">
                    Privacy Status:
                  </span>

                  <span className="font-medium text-emerald-700">
                    {consentRecorded
                      ? "Consent Recorded"
                      : "Consent Pending"}
                  </span>

                </div>

              </div>
            </div>
            {/* Workflow Pipeline Graphic */}
            <div className="my-6 max-w-lg mx-auto">
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <div className="flex flex-col items-center">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-1">✓</span>
                  <span>Received</span>
                </div>
                <div className="h-0.5 w-12 bg-blue-500" />
                <div className="flex flex-col items-center">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mb-1 animate-pulse">2</span>
                  <span className="font-bold text-blue-700">SVI Screening</span>
                </div>
                <div className="h-0.5 w-12 bg-slate-300" />
                <div className="flex flex-col items-center">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold mb-1">3</span>
                  <span>Human Review</span>
                </div>
                <div className="h-0.5 w-12 bg-slate-300" />
                <div className="flex flex-col items-center">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold mb-1">4</span>
                  <span>Support Relief</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              The automated Real-Time Stress &amp; Trauma Assessment Module is now reading the input signals to extract risk and support indicators.
            </p>
            <button
              className="px-6 py-3 border border-blue-600 text-blue-700 hover:bg-blue-50 rounded-xl text-sm font-bold mr-3"
              onClick={async () => {
                const complaints = await loadMyComplaints();
                setMyComplaints(complaints || []);
                if (complaints && complaints.length > 0) {
                  const latest = complaints[0];

                  notify(
                    `Latest complaint: ${latest.complaint_id} — Status: ${latest.status}`
                  );
                } else {
                  notify('No complaints found.');
                }
              }}
            >
              View My Complaints
            </button>
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md inline-flex items-center space-x-2" onClick={() =>
              switchTab(8, (result) => {
                setSviResult(result);
              })
            }>
              <span>Inspect AI Stress Vulnerability Analysis</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
            </button>
            {myComplaints.length > 0 && (
              <div className="mt-6 w-full max-w-3xl mx-auto">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  My Complaints
                </h3>

                <div className="space-y-4">
                  {myComplaints.map((complaint) => (
                    <div
                      key={complaint.complaint_id}
                      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Complaint ID</p>
                          <p className="font-mono font-bold text-blue-700">
                            {complaint.complaint_id}
                          </p>
                        </div>

                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                          {complaint.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-4">
                        <div>
                          <p className="text-gray-500">Language</p>
                          <p className="font-semibold">{complaint.language || "—"}</p>
                        </div>

                        <div>
                          <p className="text-gray-500">Communication</p>
                          <p className="font-semibold">
                            {complaint.communication_method || "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500">Submitted</p>
                          <p className="font-semibold">
                            {complaint.created_at
                              ? new Date(complaint.created_at).toLocaleString()
                              : "—"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-500 text-sm mb-1">Complaint</p>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {complaint.complaint_text || "—"}
                        </p>
                      </div>
                      <div className="mt-6">
                        <p className="text-gray-500 text-sm mb-3">
                          Complaint Tracking
                        </p>

                        {[
                          { status: "received", label: "Complaint Received" },
                          { status: "under_assessment", label: "AI Assessment" },
                          { status: "support_recommended", label: "Support Recommended" },
                          { status: "under_review", label: "Human Review" },
                          { status: "action_in_progress", label: "Action in Progress" },
                          { status: "resolved", label: "Resolved" },
                        ].map((stage, index) => {
                          const currentStage = getComplaintStage(complaint.status);
                          const stageIndex = getComplaintStage(stage.status);
                          const completed = stageIndex <= currentStage;

                          return (
                            <div key={stage.status}>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${completed
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-500"
                                    }`}
                                >
                                  {completed ? "✓" : index + 1}
                                </span>

                                <span
                                  className={`text-sm ${completed
                                    ? "font-semibold text-blue-700"
                                    : "text-gray-400"
                                    }`}
                                >
                                  {stage.label}
                                </span>
                              </div>

                              {index < 5 && (
                                <div className="ml-3.5 h-6 border-l-2 border-gray-200"></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
        {/* ========================================== */}
        {/* TAB 8: AI-ASSISTED SVI ANALYSIS (Pipeline) */}
        {/* ========================================== */}
        <section className="tab-panel hidden" data-purpose="ai-svi-analysis-pipeline" id="tab-panel-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-extrabold uppercase tracking-wide">Core Innovation Engine</span>
                  <span className="text-xs text-slate-400 font-mono">Model: SVI-BERT-MultiLingual v2.4</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-1">AI-Assisted Support Screening Pipeline</h2>
                <p className="text-xs text-slate-500">Autonomous extraction of psycho-social indicators for rapid human triage.</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl text-left text-xs text-amber-900 max-w-xs">
                <div className="font-bold flex items-center space-x-1">
                  <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" fillRule="evenodd" /></svg>
                  <span>Screening Notice</span>
                </div>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-snug">AI assists with prioritization only. Decisions require certified clinical oversight.</p>
              </div>
            </div>
          </div>
          {/* 7-Stage Pipeline Visualizer */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">7-Stage Evaluation Flow</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold mx-auto mb-1 flex items-center justify-center text-xs">1</div>
                <div className="font-bold text-slate-800">Input</div>
                <div className="text-[10px] text-slate-400">Captured</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold mx-auto mb-1 flex items-center justify-center text-xs">2</div>
                <div className="font-bold text-slate-800">Language</div>
                <div className="text-[10px] text-slate-400">NLP Tokenized</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold mx-auto mb-1 flex items-center justify-center text-xs">3</div>
                <div className="font-bold text-slate-800">Keywords</div>
                <div className="text-[10px] text-slate-400">Slurs &amp; Threats</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold mx-auto mb-1 flex items-center justify-center text-xs">4</div>
                <div className="font-bold text-slate-800">Distress</div>
                <div className="text-[10px] text-slate-400">Fear &amp; Insomnia</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold mx-auto mb-1 flex items-center justify-center text-xs">5</div>
                <div className="font-bold text-slate-800">Safety</div>
                <div className="text-[10px] text-slate-400">Isolation Check</div>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold mx-auto mb-1 flex items-center justify-center text-xs">6</div>
                <div className="font-bold">SVI Score</div>
                <div className="text-[10px] text-indigo-600 font-bold">
                  {sviResult ? `${sviResult.svi_score} / 100` : "Analyzing..."}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold mx-auto mb-1 flex items-center justify-center text-xs">7</div>
                <div className="font-bold">Priority</div>
                <div className="text-[10px] text-amber-700 font-bold">
                  {(() => {
                    const score = sviResult?.svi_score ?? 0;

                    if (score <= 24) return "LOW";
                    if (score <= 49) return "MODERATE";
                    if (score <= 74) return "HIGH";
                    return "URGENT";
                  })()}
                </div>
              </div>
            </div>
          </div>
          {/* Real-Time Indicators Extracted */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Indicators */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
                <span>Extracted Psycho-Social Dimensions</span>
                <span className="text-xs text-blue-600 font-medium">Weighted SVI Matrix</span>
              </h3>
              {/* 1 */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-700">Emotional Distress</span>
                  <span className="text-rose-600 font-bold">
                    {sviResult?.indicators?.distress?.detected ? 100 : 0}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{
                      width: `${sviResult?.indicators?.distress?.detected ? 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* 2 */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-700">Immediate Safety Concern</span>
                  <span className="text-amber-600 font-bold">
                    {sviResult?.indicators?.safety?.detected ? 100 : 0}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${sviResult?.indicators?.safety?.detected ? 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* 3 */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-700">Social Support Need</span>
                  <span className="text-indigo-600 font-bold">
                    {sviResult?.indicators?.support_need?.detected ? 100 : 0}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{
                      width: `${sviResult?.indicators?.support_need?.detected ? 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* 4 */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-700">Intervention Urgency</span>
                  <span className="text-amber-600 font-bold">
                    {sviResult?.svi_score ?? 0}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${sviResult?.svi_score ?? 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* 5 */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-700">
                    Support Need (Legal &amp; Police Aid)
                  </span>
                  <span className="text-rose-600 font-bold">
                    {sviResult?.indicators?.support_need?.detected ? 100 : 0}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-600 rounded-full"
                    style={{
                      width: `${sviResult?.indicators?.support_need?.detected ? 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              {/* Right Feature Extraction Breakdown */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-3">Extracted Trauma Markers</h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {sviResult?.indicators &&
                      Object.entries(sviResult.indicators)
                        .filter(([, indicator]) => indicator?.detected)
                        .map(([key, indicator]) => (
                          <span
                            key={key}
                            className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg text-xs font-semibold"
                          >
                            {key.replace(/_/g, " ")} Detected
                          </span>
                        ))}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    The NLP parser correlates regional PoA Act keyword semantics with acoustic stress indicators (in voice mode) to compute composite vulnerability.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">
                    Aggregated SVI: {sviResult ? `${sviResult.svi_score}/100` : "Analyzing..."}
                  </span>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1" onClick={(event) => { switchTab(9) }}>
                    <span>View Full SVI Report →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ========================================== */}
        {/* TAB 9: SVI RESULT / SUPPORT PRIORITY */}
        {/* ========================================== */}
        <section className="tab-panel hidden" data-purpose="svi-result-dashboard" id="tab-panel-9">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-center mb-6">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase border border-amber-200">Screening Result Available</span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">Stress Vulnerability Index (SVI)</h2>
                <p className="text-xs text-slate-500 mt-1">Calculated in real-time according to National Protection Protocol standards.</p>
              </div>
              {/* Main Gauge & Priority Banner */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-6">
                {/* Circular Gauge Visualization */}
                <div className="md:col-span-5 flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
                      {/* Background Track */}
                      <circle cx={90} cy={90} fill="transparent" r={75} stroke="#e2e8f0" strokeWidth={14} />
                      {/* High Priority Progress Arc (51/100) */}
                      <circle className="gauge-circle" cx={90} cy={90} fill="transparent" r={75} stroke="#d97706" strokeLinecap="round" strokeWidth={14} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-4xl font-black text-slate-900 tracking-tight">
                        {sviResult ? sviResult.svi_score : "..."}
                      </span>

                      <span className="text-[11px] font-semibold text-slate-400">
                        OUT OF 100
                      </span>

                      <span className="mt-1 text-[10px] uppercase font-extrabold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                        {sviResult ? `${sviResult.priority} PRIORITY` : "ANALYZING"}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-2">Threshold: 50–74 = High Support Category</span>
                </div>
                {/* Priority Interpretation & Breakdown */}
                <div className="md:col-span-7 space-y-4">
                  {/* Threshold Scales */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div className="font-bold text-slate-800 mb-2">Government Support Priority Scale:</div>
                    <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold">
                      <div className="p-1.5 rounded bg-emerald-100 text-emerald-800">0–24<br />Low</div>
                      <div className="p-1.5 rounded bg-blue-100 text-blue-800">25–49<br />Moderate</div>
                      <div className="p-1.5 rounded bg-amber-500 text-white shadow">50–74<br />HIGH (Active)</div>
                      <div className="p-1.5 rounded bg-rose-100 text-rose-800">75–100<br />Urgent</div>
                    </div>
                  </div>
                  {/* Key Metrics */}
                  {/* Key Metrics */}
                  <div className="space-y-2 text-xs">
                    {(() => {
                      const score = sviResult?.svi_score ?? 0;
                      const indicators = sviResult?.indicators || {};

                      const distress = indicators.distress?.detected ? 100 : 0;
                      const safety = indicators.safety?.detected ? 100 : 0;
                      const support = indicators.support_need?.detected ? 100 : 0;

                      const distressScore = Math.round(score * 0.5 + distress * 0.5);
                      const threatScore = Math.round(score * 0.3 + safety * 0.7);
                      const legalScore = Math.round(score * 0.4 + support * 0.6);

                      const getLevel = (value) => {
                        if (value >= 75) return "High";
                        if (value >= 50) return "Elevated";
                        if (value >= 25) return "Moderate";
                        return "Low";
                      };

                      return (
                        <>
                          <div className="flex justify-between border-b border-slate-100 pb-1.5">
                            <span className="text-slate-600">
                              Emotional Distress Level:
                            </span>
                            <span className="font-bold text-rose-600">
                              {getLevel(distressScore)} ({distressScore} / 100)
                            </span>
                          </div>

                          <div className="flex justify-between border-b border-slate-100 pb-1.5">
                            <span className="text-slate-600">
                              Physical Threat Severity:
                            </span>
                            <span className="font-bold text-amber-600">
                              {getLevel(threatScore)} Threat ({threatScore} / 100)
                            </span>
                          </div>

                          <div className="flex justify-between border-b border-slate-100 pb-1.5">
                            <span className="text-slate-600">
                              Legal Aid Urgency:
                            </span>
                            <span className="font-bold text-rose-600">
                              {getLevel(legalScore)} Urgency ({legalScore} / 100)
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
              {/* Important Safety Notice Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                <div>
                  <span className="font-bold text-blue-950 block">AI-Assisted Screening — Not a Medical Diagnosis</span>
                  <p className="mt-0.5 text-blue-800">
                    This screening result is an indicator of support requirements. It helps our clinical officers prioritize response times and mobilize appropriate resources without delay.
                  </p>
                </div>
              </div>
              {/* Bottom Action */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100" onClick={(event) => { switchTab(8) }}>
                  Back to Pipeline
                </button>
                <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow flex items-center space-x-2" onClick={(event) => { switchTab(10) }}>
                  <span>Proceed to Human Review →</span>
                </button>
              </div>
            </div>
          </div>
        </section>
        {/* ========================================== */}
        {/* TAB 10: HUMAN REVIEW (Human-in-the-loop) */}
        {/* ========================================== */}
        <section className="tab-panel hidden" data-purpose="hitl-oversight-screen" id="tab-panel-10">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase border border-emerald-200">Human-In-The-Loop (HITL) Governance</span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Human Review &amp; Professional Verification</h2>
              <p className="text-xs text-slate-500 mt-1">AI assists with screening. Human professionals remain fully responsible for support decisions.</p>
            </div>
            {/* 3-Step Verification Pipeline */}
            <div className="flex items-center justify-center space-x-2 text-xs font-semibold my-6">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800">1. AI Screening Complete</span>
              <span className="text-slate-400">→</span>
              <span className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800">2. Priority Generated: HIGH</span>
              <span className="text-slate-400">→</span>
              <span className="px-3 py-1.5 rounded-lg bg-blue-600 text-white shadow">3. Clinical Human Review</span>
            </div>
            {/* Reviewer Status Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-sm">
                    DK
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Dr. D. Krishnan, M.Phil, Clinical Psych</h4>
                    <p className="text-xs text-slate-500">Authorized Government Review Officer (Desk #04)</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">Verified Officer</span>
              </div>
              <div className="pt-4 space-y-3 text-xs text-slate-700">
                <div>
                  <span className="font-bold block text-slate-900">Clinical Verification Note:</span>
                  <p className="text-slate-600 mt-1 bg-white p-3 rounded-lg border border-slate-200 italic">
                    "Reviewed statement NHAA-2026-004821. Confirmed acute emotional distress and village-level intimidation. I validate the High Priority triage and recommend immediate Psychological First Aid (PFA) and legal cell coordination within 2 hours."
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Status: <strong className="text-emerald-700">Support Priority Confirmed by Human Specialist</strong></span>
                  <span>Signed digitally: SHA256-49f8a2...</span>
                </div>
              </div>
            </div>
            {/* Core Government Motto Badge */}
            <div className="text-center p-4 rounded-xl bg-blue-900 text-white text-xs font-semibold mb-6">
              "AI assists with screening. Human professionals remain responsible for appropriate support decisions."
            </div>
            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
              <button className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100" onClick={(event) => { switchTab(9) }}>
                Back to SVI
              </button>
              <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow flex items-center space-x-2" onClick={(event) => { switchTab(11) }}>
                <span>View Recommended Pathways →</span>
              </button>
            </div>
          </div>
        </section>
        {/* ========================================== */}
        {/* TAB 11: AI-ASSISTED RECOMMENDATIONS */}
        {/* ========================================== */}
        <section className="tab-panel hidden" data-purpose="ai-recommendations-pathways" id="tab-panel-11">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase">Dynamic Pathways</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Recommended Support Actions</h2>
                <p className="text-xs text-slate-500">
                  Customized according to verified SVI score{" "}
                  {sviResult ? `${sviResult.svi_score} (${sviResult.priority} Priority)` : "Analyzing..."}.
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold">
                {sviResult
                  ? `${sviResult.priority} Priority Flow`
                  : "Assessment Pending"}
              </span>            </div>
            {/* Dynamic Recommendation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* LOW / MODERATE */}
              {(sviResult?.priority === "LOW" ||
                sviResult?.priority === "MODERATE") && (
                  <>
                    {/* Recommendation 1 */}
                    <div className="bg-white p-6 rounded-2xl border-2 border-blue-500 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                          <span className="text-xl">👥</span>
                        </div>

                        <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          Recommended Support
                        </span>

                        <h3 className="font-bold text-base text-slate-900 mt-2">
                          Support Caseworker
                        </h3>

                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          Guidance and assistance for your complaint and next steps.
                        </p>
                      </div>

                      <button
                        className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition"
                        onClick={() => switchTab(12)}
                      >
                        Connect with Caseworker →
                      </button>
                    </div>

                    {/* Recommendation 2 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                          <span className="text-xl">💚</span>
                        </div>

                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Emotional Support
                        </span>

                        <h3 className="font-bold text-base text-slate-900 mt-2">
                          Counsellor Support
                        </h3>

                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          Emotional support and counselling assistance based on your assessment.
                        </p>
                      </div>

                      <button
                        className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition"
                        onClick={() => switchTab(12)}
                      >
                        Connect with Counsellor →
                      </button>
                    </div>
                  </>
                )}

              {/* HIGH */}
              {sviResult?.priority === "HIGH" && (
                <>
                  {/* Recommendation 1 */}
                  <div className="bg-white p-6 rounded-2xl border-2 border-orange-500 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center mb-4">
                        <span className="text-xl">👥</span>
                      </div>

                      <span className="text-[10px] uppercase font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                        Priority Support
                      </span>

                      <h3 className="font-bold text-base text-slate-900 mt-2">
                        Priority Caseworker
                      </h3>

                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Priority human assistance for your complaint and support needs.
                      </p>
                    </div>

                    <button
                      className="mt-6 w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition"
                      onClick={() => switchTab(12)}
                    >
                      Get Priority Support →
                    </button>
                  </div>

                  {/* Recommendation 2 */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                        <span className="text-xl">💚</span>
                      </div>

                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Trauma Support
                      </span>

                      <h3 className="font-bold text-base text-slate-900 mt-2">
                        Trauma Counsellor
                      </h3>

                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Priority counselling support and guidance from a human professional.
                      </p>
                    </div>

                    <button
                      className="mt-6 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                      onClick={() => switchTab(12)}
                    >
                      Connect with Counsellor →
                    </button>
                  </div>

                  {/* Recommendation 3 */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                        <span className="text-xl">☎</span>
                      </div>

                      <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                        Helpline
                      </span>

                      <h3 className="font-bold text-base text-slate-900 mt-2">
                        NHAA Helpline
                      </h3>

                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Contact the support helpline for further assistance.
                      </p>
                    </div>

                    <a
                      className="mt-6 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold text-center block transition"
                      href="tel:14566"
                    >
                      Call 14566 →
                    </a>
                  </div>
                </>
              )}

              {/* URGENT */}
              {sviResult?.priority === "URGENT" && (
                <>
                  {/* Recommendation 1 */}
                  <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-500 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-4">
                        <span className="text-xl">⚠</span>
                      </div>

                      <span className="text-[10px] uppercase font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                        Urgent Support
                      </span>

                      <h3 className="font-bold text-base text-red-900 mt-2">
                        Urgent Human Support
                      </h3>

                      <p className="text-xs text-red-700 mt-2 leading-relaxed">
                        Your assessment indicates an urgent need for human support.
                      </p>
                    </div>

                    <button
                      className="mt-6 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition"
                      onClick={() => switchTab(12)}
                    >
                      Get Urgent Support →
                    </button>
                  </div>

                  {/* Recommendation 2 */}
                  <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center mb-4">
                        <span className="text-xl">💚</span>
                      </div>

                      <span className="text-[10px] uppercase font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                        Trauma Support
                      </span>

                      <h3 className="font-bold text-base text-slate-900 mt-2">
                        Trauma Counsellor
                      </h3>

                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Immediate human counselling support based on the assessment.
                      </p>
                    </div>

                    <button
                      className="mt-6 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition"
                      onClick={() => switchTab(12)}
                    >
                      Connect Now →
                    </button>
                  </div>

                  {/* Recommendation 3 */}
                  <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                        <span className="text-xl">☎</span>
                      </div>

                      <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                        Immediate Helpline
                      </span>

                      <h3 className="font-bold text-base text-slate-900 mt-2">
                        NHAA Helpline
                      </h3>

                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Contact the support helpline for immediate assistance.
                      </p>
                    </div>

                    <a
                      className="mt-6 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold text-center block transition"
                      href="tel:14566"
                    >
                      Call 14566 →
                    </a>
                  </div>
                </>
              )}

            </div>
            <div className="flex items-center justify-between pt-4">
              <button className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100" onClick={(event) => { switchTab(10) }}>
                Back to Review
              </button>
              <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow flex items-center space-x-2" onClick={(event) => { switchTab(12) }}>
                <span>Access Human Support Team →</span>
              </button>
            </div>
          </div>
        </section>
        {/* ========================================== */}
        {/* TAB 12: HUMAN SUPPORT TEAM */}
        {/* ========================================== */}
        <section className="tab-panel hidden" data-purpose="human-support-directory" id="tab-panel-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase">On-Demand Human Relief</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">Official NHAA Human Support Team</h2>
              <p className="text-xs text-slate-500 mt-1">Connect directly with accredited personnel dedicated to victim welfare.</p>
            </div>
            {/* 3 Cards: Support Caseworker, Counsellor, Helpline 14566 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Card 1: Caseworker */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Support Caseworker</h3>
                  <p className="text-xs text-slate-500 mt-1">Assigned: S. Meenakshi (ID #CW-TN-204)</p>
                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Available on portal message desk</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>PoA Act Relief Compensation Guide</span>
                    </div>
                  </div>
                </div>
                <button className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition" onClick={(event) => { notify('Initiating confidential caseworker chat channel...'); }}>
                  Message Caseworker
                </button>
              </div>
              {/* Card 2: Counsellor */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Trauma Counsellor</h3>
                  <p className="text-xs text-slate-500 mt-1">Certified Trauma-Informed Therapist</p>
                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Video / Audio Call Scheduling</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>Confidential psychological decompression</span>
                    </div>
                  </div>
                </div>
                <button className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition" onClick={(event) => { notify('Scheduled 30-min trauma counselling session with counsellor.'); }}>
                  Schedule Counselling
                </button>
              </div>
              {/* Card 3: 14566 Helpline */}
              <div className="bg-gradient-to-br from-rose-900 to-red-800 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-rose-700 text-rose-100 px-2 py-0.5 rounded">Emergency Escalation</span>
                  <h3 className="font-black text-xl mt-2">Helpline 14566</h3>
                  <p className="text-xs text-rose-100 mt-1">National Helpline Against Atrocities</p>
                  <div className="mt-3 text-xs text-rose-100 space-y-1">
                    <div>• Toll-free 24 hours / 7 days</div>
                    <div>• Zero-wait police &amp; DM connect</div>
                  </div>
                </div>
                <a className="mt-6 w-full py-2.5 bg-white text-rose-900 hover:bg-rose-50 text-center rounded-lg text-xs font-black shadow transition block" href="tel:14566">
                  Dial 14566 Now
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <button className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100" onClick={(event) => { switchTab(11) }}>
                Back to Recommendations
              </button>
              <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow flex items-center space-x-2" onClick={(event) => { switchTab(13) }}>
                <span>Specialist Psychologist / Psychiatrist Support →</span>
              </button>
            </div>
          </div>
        </section>
        {/* ========================================== */}
        {/* TAB 13: PSYCHOLOGIST / PSYCHIATRIST SUPPORT */}
        {/* ========================================== */}
        <section className="tab-panel hidden" data-purpose="clinical-tier-support" id="tab-panel-13">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full uppercase border border-purple-200">Tier 3 Clinical Escalation</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">Clinical Mental Health Support</h2>
              <p className="text-xs text-slate-500 mt-1">When clinically warranted, complainants receive direct referral to authorized government medical professionals.</p>
            </div>
            {/* 2 Main Clinical Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Psychologist Card */}
              <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Licensed Psychologist</h3>
                      <p className="text-xs text-slate-500">Counselling &amp; Trauma Psychotherapy</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-slate-600 my-4">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-bold text-slate-800 block">Scope of Clinical Care:</span>
                      <span className="text-slate-600">Standardized Trauma Evaluation, PTSD Symptom Management, Coping Interventions.</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-bold text-slate-800 block">Session Mode:</span>
                      <span className="text-slate-600">Secure Audio / Video tele-session through Tele-MANAS framework.</span>
                    </div>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition" onClick={(event) => { notify('Appointment requested: Forwarding to district hospital psychological unit.'); }}>
                  Request Clinical Psychologist Session
                </button>
              </div>
              {/* Psychiatrist Card */}
              <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Consultant Psychiatrist</h3>
                      <p className="text-xs text-slate-500">Medical Mental-Health Evaluation</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-slate-600 my-4">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-bold text-slate-800 block">Medical Evaluation:</span>
                      <span className="text-slate-600">Evaluation for severe trauma, chronic insomnia, somatic distress, pharmacotherapy if medically appropriate.</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-bold text-slate-800 block">Government Certificate:</span>
                      <span className="text-slate-600">Official medical report generation for court documentation under PoA proceedings.</span>
                    </div>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold transition" onClick={(event) => { notify('Priority psychiatric referral scheduled with District Nodal Mental Health Unit.'); }}>
                  Request Medical Psychiatric Consultation
                </button>
              </div>
            </div>
            {/* Completion / Evaluator Reset Banner */}
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
              <h4 className="font-bold text-emerald-900 text-base">End-to-End Prototype Flow Complete</h4>
              <p className="text-xs text-emerald-700 max-w-lg mx-auto mt-1">
                You have successfully explored all 13 interactive stages of the NHAA AI-Assisted Stress &amp; Trauma Assessment Module for SIH.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <button className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold" onClick={(event) => { switchTab(1) }}>
                  Restart Flow (Tab 1)
                </button>
                <button className="px-5 py-2 bg-white text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold" onClick={(event) => { openModal('howItWorksModal') }}>
                  View Architectural Overview
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* END: MainContentWrapper */}
      {/* BEGIN: HowItWorksModal */}
      <div className="fixed inset-0 z-50 bg-slate-950/70 hidden flex items-center justify-center p-4 backdrop-blur-xs" data-purpose="how-svi-works-modal" id="howItWorksModal">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase">Architecture &amp; Ethics</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">How the AI-Assisted SVI System Operates</h3>
            </div>
            <button className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold" onClick={(event) => { closeModal('howItWorksModal') }}>✕</button>
          </div>
          <div className="space-y-4 my-6 text-xs text-slate-700 leading-relaxed">
            <p>
              The <strong>Support Vulnerability Index (SVI)</strong> is an innovative assistive technology developed for the <strong>National Helpline Against Atrocities (14566)</strong>. It bridges the critical time gap between incident filing and professional human intervention.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm">The 7-Step Algorithmic Pipeline:</div>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600 font-medium">
                <li><strong>Intake Ingestion:</strong> Ingests speech audio, IVRS responses, or multi-script regional text.</li>
                <li><strong>Regional NLP Normalization:</strong> Translates 12 Indian languages while preserving dialectal trauma metaphors.</li>
                <li><strong>Keyword &amp; Context Mining:</strong> Flags specific PoA Act violations, slurs, threats of evictions, and boycotts.</li>
                <li><strong>Psychometric Distress Scoring:</strong> Estimates distress keywords (panic, helplessness, sleeplessness, suicidal ideation).</li>
                <li><strong>Physical Safety Indexing:</strong> Correlates attacker proximity and ongoing retaliation risks.</li>
                <li><strong>SVI Aggregation:</strong> Calculates a composite 0–100 integer reflecting urgent support necessity.</li>
                <li><strong>Human-in-the-Loop Routing:</strong> Dispatches priority to human clinical caseworkers for mandatory verification.</li>
              </ol>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
              <strong>Non-Medical Disclaimer:</strong> SVI does not formulate a psychiatric diagnosis. It functions as a psycho-social triage tool ensuring high-distress complainants receive immediate certified human contact.
            </div>
            <div className="text-center p-3 bg-blue-900 text-white rounded-lg font-bold">
              "AI assists. Humans support. Professionals decide."
            </div>
          </div>
          <div className="text-right">
            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg" onClick={(event) => { closeModal('howItWorksModal') }}>Close Overview</button>
          </div>
        </div>
      </div>
      {/* END: HowItWorksModal */}
      {/* BEGIN: EmergencyCrisisModal */}
      <div className="fixed inset-0 z-50 bg-rose-950/80 hidden flex items-center justify-center p-4 backdrop-blur-xs" data-purpose="emergency-crisis-modal" id="emergencyModal">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-rose-300">
          <div className="flex items-center space-x-3 text-rose-600 mb-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" fillRule="evenodd" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-black text-rose-900">Emergency Crisis Protocol Active</h3>
              <p className="text-xs text-rose-700 font-semibold">Immediate Assistance Overriding Automated Intake</p>
            </div>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed mb-6">
            If you or your family members are facing imminent physical danger, violence, or severe life-threatening crisis, do not wait for online screening. Connect directly to government first responders:
          </p>
          <div className="space-y-3 mb-6">
            <a className="flex items-center justify-between p-4 rounded-xl bg-rose-700 text-white font-bold hover:bg-rose-800 transition" href="tel:14566">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                <div className="text-left">
                  <span className="text-xs font-semibold text-rose-200 block">NHAA 24x7 Helpline</span>
                  <span className="text-base font-black">Call 14566</span>
                </div>
              </div>
              <span className="text-xs uppercase bg-white/20 px-2.5 py-1 rounded">Direct Line</span>
            </a>
            <a className="flex items-center justify-between p-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-black transition" href="tel:112">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                <div className="text-left">
                  <span className="text-xs font-semibold text-slate-400 block">National Emergency Response</span>
                  <span className="text-base font-black">Call 112 (Police / Medical)</span>
                </div>
              </div>
              <span className="text-xs uppercase bg-white/20 px-2.5 py-1 rounded">Police Dispatch</span>
            </a>
          </div>
          <div className="flex justify-between items-center pt-2">
            <button className="text-xs font-semibold text-slate-500 hover:text-slate-800" onClick={(event) => { closeModal('emergencyModal') }}>
              I am safe, return to intake
            </button>
            <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg" onClick={(event) => { closeModal('emergencyModal') }}>
              Dismiss
            </button>
          </div>
        </div>
      </div>
      {/* END: EmergencyCrisisModal */}
      {/* BEGIN: Footer */}
      <footer className="bg-[#0A2540] text-slate-300 text-xs mt-12 border-t border-slate-800" data-purpose="gov-portal-footer">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="font-bold text-white text-sm">NHAA Integrated Support Portal</div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              An initiative under the Ministry of Social Justice &amp; Empowerment for real-time trauma triage, victim rehabilitation, and legal empowerment under PoA Act 1989.
            </p>
            <div className="text-[10px] text-slate-500">
              Developed for Smart India Hackathon (SIH 2026).
            </div>
          </div>
          <div>
            <div className="font-bold text-white mb-2">Emergency Helplines</div>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>• NHAA Atrocity Helpline: <strong className="text-white">14566 (24x7)</strong></li>
              <li>• National Emergency: <strong className="text-white">112</strong></li>
              <li>• Tele-MANAS Mental Health: <strong className="text-white">14416</strong></li>
              <li>• Women Helpline: <strong className="text-white">181</strong></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-white mb-2">Statutory Mandate</div>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>Scheduled Castes &amp; Scheduled Tribes (PoA) Act, 1989</li>
              <li>PoA Rules, 1995 (Relief &amp; Rehabilitation)</li>
              <li>Zero Discrimination Digital Standards</li>
              <li>NIC Cloud Security &amp; ISO 27001 Aligned</li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-white mb-2">Portal Principles</div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] space-y-1 text-slate-300">
              <div className="font-bold text-amber-400">AI assists. Humans support.</div>
              <p className="text-[10px] text-slate-400">Algorithmic indicators are advisory only and must receive validation by certified clinical caseworkers before institutional action.</p>
            </div>
          </div>
        </div>
        <div className="bg-black/40 py-3 border-t border-slate-800 text-center text-[10px] text-slate-400">
          © 2026 Ministry of Social Justice and Empowerment, Government of India. All rights reserved.
        </div>
      </footer>
      {/* END: Footer */}
      {/* BEGIN: InteractivePrototypeLogic */}
    </div>

  );
}