import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/recovery-verify")({
  head: () => ({
    meta: [
      { title: "NHAA 14566 - Password Recovery (Step 2: 2FA Verification)" },
      { name: "description", content: "NHAA 14566 - Password Recovery (Step 2: 2FA Verification) — National Atrocity Helpline & Case Intelligence System portal." },
      { property: "og:title", content: "NHAA 14566 - Password Recovery (Step 2: 2FA Verification)" },
      { property: "og:description", content: "NHAA 14566 - Password Recovery (Step 2: 2FA Verification) — National Atrocity Helpline & Case Intelligence System portal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RecoveryVerify,
});

function RecoveryVerify() {
  const navigate = useNavigate();
  return (
    <div className="bg-govSurface text-govTextDark font-sans min-h-screen flex flex-col justify-between antialiased">


  
  <header className="bg-white border-b border-govBorder shadow-sm px-6 lg:px-12 py-3.5 flex items-center justify-between">
    <div className="flex items-center space-x-6">
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYUrOU4p_czUKeO1QR0tBHO0x7paEH-gLlhGtoqjgKiREAyhqjNrH54_ZUH1X8_wxt1-rG8ms2AMj1n28t0S6TJJxdxno3ME4P_xab9KgJO2bjf8N8HSSl8--mkRC97Ec0fiQAoZRo-FymfHrR6nGA8jW3tgguLTD8WiAH3K_2QnoPwgy6yWocxx6oVajkutQDnC1w5hHebqc4W4oVWEOlF9Zcyd_wTjMrOLzkUkIytsRFVfLNJ_Rxv4Nf-L6hdnr_yQ" alt="Ministry of Social Justice & Empowerment" className="h-10 lg:h-12 object-contain" />
      <div className="h-8 w-px bg-govBorder"></div>
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP3QUJrK9cY0rlDkAclx_Jh7rOmfuA5OVS2_9lIsTc-ZiIJ_AlYWrRuCeUsWPlDAkj6Zpw0bHz4WCAPDyEzSmwkKuLz9JPgOtVm_xyZfYS6JTwFB1NsTm-d_6yE1IVEsCHpBZz2iEMWPHYv1xtLHIC0TkXnazKGDPuDOq6iFGOISSHsASkrGSyP5uBotcHoflgfz8_b4x6zo9ODnTQYOkEbh-TILKQOwV0KZYvvK1Ibt1w-omxYo-AeiN186PQnrh2nw" alt="NHAA 14566" className="h-9 lg:h-11 object-contain" />
    </div>

    <div className="flex items-center space-x-6">
      
      <div className="hidden md:flex items-center space-x-3 text-sm">
        <div className="flex items-center text-green-700 font-semibold">
          <i className="fa-solid fa-circle-check text-green-600 mr-1.5"></i>
          <span>Identify</span>
        </div>
        <i className="fa-solid fa-arrow-right text-xs text-gray-400"></i>
        <div className="flex items-center text-govNavy font-semibold">
          <span className="w-6 h-6 rounded-full bg-govNavy text-white flex items-center justify-center text-xs mr-2">2</span>
          <span>Verify 2FA</span>
        </div>
        <i className="fa-solid fa-arrow-right text-xs text-gray-400"></i>
        <div className="flex items-center text-gray-400 font-medium">
          <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs mr-2">3</span>
          <span>New Password</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-xs text-govTextMuted bg-gray-100 py-1.5 px-3 rounded-full border border-gray-200">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span className="font-medium">Session #REC-8219</span>
      </div>
    </div>
  </header>

  
  <main className="flex-1 flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-lg">

      
      <div className="bg-white rounded-xl shadow-md border border-govBorder overflow-hidden">
        
        <div className="bg-govNavy text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute right-4 -bottom-4 opacity-10 text-7xl">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <div className="inline-flex items-center space-x-2 bg-blue-900/60 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase text-blue-200 mb-3">
            <i className="fa-solid fa-lock text-xs text-govAccent"></i>
            <span>Step 2 of 3: Identity Verification</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Verify Your Identity</h1>
          <p className="text-sm text-blue-100 mt-1 leading-relaxed">
            Enter the 6-digit statutory security code sent to your registered official device.
          </p>
        </div>

        
        <form className="p-6 sm:p-7 space-y-5">
          
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-govNavy text-white flex items-center justify-center font-bold text-xs">
                PRO
              </div>
              <div>
                <p className="text-xs font-bold text-govTextDark">Professional A (PRO-001)</p>
                <p className="text-[11px] text-govTextMuted">Registered Mobile: +91 98XXX-XXX12</p>
              </div>
            </div>
            <a href="#" className="text-xs font-semibold text-govBlue hover:underline">Change ID</a>
          </div>

          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-govTextDark">
                Recovery Security Code <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Simulated Code: <strong>830154</strong></span>
            </div>

            <div className="grid grid-cols-6 gap-2 sm:gap-3">
              <input type="text" maxLength={1} defaultValue="8" className="w-full h-13 py-3 text-center text-xl font-bold bg-gray-50 border-2 border-govNavy rounded-lg focus:outline-none focus:ring-2 focus:ring-govBlue focus:bg-white" />
              <input type="text" maxLength={1} defaultValue="3" className="w-full h-13 py-3 text-center text-xl font-bold bg-gray-50 border-2 border-govNavy rounded-lg focus:outline-none focus:ring-2 focus:ring-govBlue focus:bg-white" />
              <input type="text" maxLength={1} defaultValue="0" className="w-full h-13 py-3 text-center text-xl font-bold bg-gray-50 border-2 border-govNavy rounded-lg focus:outline-none focus:ring-2 focus:ring-govBlue focus:bg-white" />
              <input type="text" maxLength={1} defaultValue="1" className="w-full h-13 py-3 text-center text-xl font-bold bg-gray-50 border-2 border-govNavy rounded-lg focus:outline-none focus:ring-2 focus:ring-govBlue focus:bg-white" />
              <input type="text" maxLength={1} defaultValue="5" className="w-full h-13 py-3 text-center text-xl font-bold bg-gray-50 border-2 border-govNavy rounded-lg focus:outline-none focus:ring-2 focus:ring-govBlue focus:bg-white" />
              <input type="text" maxLength={1} defaultValue="4" className="w-full h-13 py-3 text-center text-xl font-bold bg-gray-50 border-2 border-govNavy rounded-lg focus:outline-none focus:ring-2 focus:ring-govBlue focus:bg-white" />
            </div>

            <div className="flex items-center justify-between text-xs mt-2.5 text-govTextMuted">
              <span className="flex items-center">
                <i className="fa-regular fa-clock mr-1"></i> Resend code in <strong className="text-govNavy ml-1 font-semibold">00:28</strong>
              </span>
              <button type="button" className="text-govBlue hover:underline font-medium">Resend Code</button>
            </div>
          </div>

          
          <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3.5 flex items-start space-x-3 text-xs text-emerald-900">
            <i className="fa-solid fa-circle-check text-emerald-600 text-base mt-0.5"></i>
            <div>
              <p className="font-bold text-emerald-950">Identity Verified • Recovery Token Accepted</p>
              <p className="text-emerald-800 text-[11px] mt-0.5">Security clearance validated. Proceed to define your new sovereign access password.</p>
            </div>
          </div>

          
          <button 
            type="submit" 
            className="w-full bg-govNavy hover:bg-govBlue text-white font-semibold py-3.5 px-4 rounded-lg shadow transition duration-150 ease-in-out flex items-center justify-center space-x-2 text-sm" onClick={() => navigate({ to: "/new-password" })}>
            <i className="fa-solid fa-lock-open text-xs"></i>
            <span>Continue to Create Password</span>
          </button>

          
          <div className="flex items-center justify-between text-xs pt-1 text-govTextMuted">
            <a href="#" className="inline-flex items-center text-govBlue hover:underline">
              <i className="fa-solid fa-fingerprint mr-1"></i> Use hardware key / biometric
            </a>
            <a href="/reset-password" className="text-govTextMuted hover:underline">Back to Step 1</a>
          </div>

          
          <div className="border-t border-gray-100 pt-3.5 mt-2 flex items-center justify-between text-[11px] text-govTextMuted">
            <span className="flex items-center">
              <i className="fa-solid fa-shield-cat text-green-600 mr-1.5"></i> Statutory 2FA Verification Desk
            </span>
            <span>IP: 10.12.84.19 (Protected Gateway)</span>
          </div>

        </form>
      </div>

      
      <div className="mt-4 bg-white/70 border border-dashed border-gray-300 rounded-lg py-2.5 px-4 text-center text-xs text-govTextMuted">
        <span className="text-green-700 font-semibold"><i className="fa-solid fa-circle-check mr-1"></i> Prototype simulation:</span> Code prefilled and verified without external SMS/telecom latency.
      </div>

    </div>
  </main>

  
  <footer className="bg-white border-t border-govBorder py-4 px-6 lg:px-12 text-xs text-govTextMuted flex flex-col md:flex-row items-center justify-between gap-2">
    <div>
      © 2026 Ministry of Social Justice and Empowerment, Government of India.
    </div>
    <div className="flex items-center space-x-6">
      <a href="#" className="hover:underline">Cyber Security Policy</a>
      <span>•</span>
      <a href="#" className="hover:underline">Terms of Usage</a>
      <span>•</span>
      <a href="#" className="hover:underline">NIC Guidelines</a>
    </div>
  </footer>


    </div>
  );
}
