import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "NHAA 14566 - Reset Password (Step 1: Officer Identification)" },
      { name: "description", content: "NHAA 14566 - Reset Password (Step 1: Officer Identification) — National Atrocity Helpline & Case Intelligence System portal." },
      { property: "og:title", content: "NHAA 14566 - Reset Password (Step 1: Officer Identification)" },
      { property: "og:description", content: "NHAA 14566 - Reset Password (Step 1: Officer Identification) — National Atrocity Helpline & Case Intelligence System portal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  return (
    <div className="bg-govSurface text-govTextDark font-sans min-h-screen flex flex-col justify-between antialiased">


  
  <header className="bg-white border-b border-govBorder shadow-sm px-6 lg:px-12 py-3.5 flex items-center justify-between">
    <div className="flex items-center space-x-6">
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoFYGodkdBaQ4AGApikmUaYCOmZ-zyNFyw3lu-nank2G2ethtnPgcqzJrsd4V1lbgdDGNmrFszjfaC71vjTPRSdyuuKrPvw0Tvl2P2lFt8NnViBtIg2u5U1o_ri04rXn6NUcueol2iqqV0B8O0Xg7w5JN6f7LbyPBFT5R8EDwP00CVaK2qLktkFNlZcPwvbX_0LjXinmNFgwJDr190-YBriv8dqq7LRiEzlBTj9_qmzCQy1mizLHxKWM6nYqGFMoLUDA" alt="Ministry of Social Justice & Empowerment" className="h-10 lg:h-12 object-contain" />
      <div className="h-8 w-px bg-govBorder"></div>
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8KUh8W2wYlHZAG0V6yvnnWbiJswpp05fOGPsg-R-Ff12pY2JoAfcOD8ut1Tt98M7fdDnFDz3Qdp2eB4F2RZJ8JxGO8Os9VZNb1YLPgvDpnkn4zz8Y886T4k8lZgwdggFbk1fBo8mvZjScJG-rvClt8ZcevHACjWCSPPCfUvHUSlQIjMXyxRGvdqab8ftj8uVLLxoxz0qohqs06CoEP8E1Jue9F6sJ1Bikd7uxA5W8wkYeAI1aM3_8AghJAx1exilfZA" alt="NHAA 14566" className="h-9 lg:h-11 object-contain" />
    </div>

    <div className="flex items-center space-x-6">
      
      <div className="hidden md:flex items-center space-x-3 text-sm">
        <div className="flex items-center text-govNavy font-semibold">
          <span className="w-6 h-6 rounded-full bg-govNavy text-white flex items-center justify-center text-xs mr-2">1</span>
          <span>Identify</span>
        </div>
        <i className="fa-solid fa-arrow-right text-xs text-gray-400"></i>
        <div className="flex items-center text-gray-400 font-medium">
          <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs mr-2">2</span>
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
        <span className="font-medium">Govt. High Security Zone</span>
      </div>
    </div>
  </header>

  
  <main className="flex-1 flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-lg">

      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 mb-6 flex items-start space-x-3 text-xs text-blue-900">
        <i className="fa-solid fa-circle-info text-blue-700 text-sm mt-0.5"></i>
        <p className="leading-relaxed">
          <strong>Official Recovery Desk:</strong> Password reset is restricted to verified caseworkers, nodal officers, and authorized legal counselors under the Ministry of Social Justice & Empowerment guidelines.
        </p>
      </div>

      
      <div className="bg-white rounded-xl shadow-md border border-govBorder overflow-hidden">
        
        <div className="bg-govNavy text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute right-4 -bottom-4 opacity-10 text-7xl">
            <i className="fa-solid fa-key"></i>
          </div>
          <div className="inline-flex items-center space-x-2 bg-blue-900/60 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase text-blue-200 mb-3">
            <i className="fa-solid fa-shield-halved text-xs text-govAccent"></i>
            <span>Step 1 of 3: Officer Recovery</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
          <p className="text-sm text-blue-100 mt-1 leading-relaxed">
            Enter your official Professional ID or government registered email to receive statutory verification credentials.
          </p>
        </div>

        
        <form className="p-6 sm:p-7 space-y-5">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-govTextDark mb-1.5" htmlFor="prof-id">
              Professional ID / Official Email <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <i className="fa-solid fa-id-badge"></i>
              </div>
              <input 
                type="text" 
                id="prof-id"
                defaultValue="PRO-001@nhaa.gov.in" 
                className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-govBorder rounded-lg text-sm text-govTextDark font-medium focus:ring-2 focus:ring-govBlue focus:border-govBlue focus:bg-white transition-colors" 
                placeholder="E.g., PRO-001, Nodal ID, or official gov email"
                required
              />
            </div>
            <p className="text-xs text-govTextMuted mt-1.5 flex items-center">
              <i className="fa-solid fa-circle-check text-green-600 mr-1.5"></i>
              Verified official registry match: <strong>Desk PRO-001 (Tamil Nadu Nodal Office)</strong>
            </p>
          </div>

          
          <div className="bg-gray-50 p-3.5 rounded-lg border border-govBorder flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input type="checkbox" id="captcha-check" defaultChecked className="h-4 w-4 text-govBlue rounded border-gray-300 focus:ring-govBlue" />
              <label htmlFor="captcha-check" className="text-xs font-semibold text-govTextDark cursor-pointer">I'm an authorized statutory officer</label>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-100 text-green-800 border border-green-200">
              <i className="fa-solid fa-check mr-1 text-green-600"></i> CAPTCHA Validated
            </span>
          </div>

          
          <button 
            type="submit" 
            className="w-full bg-govNavy hover:bg-govBlue text-white font-semibold py-3.5 px-4 rounded-lg shadow transition duration-150 ease-in-out flex items-center justify-center space-x-2 text-sm" onClick={() => navigate({ to: "/recovery-verify" })}>
            <span>Continue to 2FA Verification</span>
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </button>

          
          <div className="text-center pt-2">
            <a href="#" className="inline-flex items-center text-xs font-semibold text-govBlue hover:underline">
              <i className="fa-solid fa-arrow-left mr-1.5 text-xs"></i>
              Back to Professional Login
            </a>
          </div>

          
          <div className="border-t border-gray-100 pt-4 mt-2 flex items-center justify-between text-[11px] text-govTextMuted">
            <span className="flex items-center">
              <i className="fa-solid fa-lock text-green-600 mr-1.5"></i> 256-bit TLS Encrypted
            </span>
            <span>Helpline Helpdesk: 14566</span>
          </div>

        </form>
      </div>

      <div className="text-center mt-6 text-xs text-govTextMuted">
        National Helpline Against Atrocities (NHAA 14566) • Ministry of Social Justice & Empowerment<br/>
        Statutory Portal under the SC/ST (Prevention of Atrocities) Act & Rules
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
