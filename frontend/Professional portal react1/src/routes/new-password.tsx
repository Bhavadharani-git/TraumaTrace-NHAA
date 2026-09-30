import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/new-password")({
  head: () => ({
    meta: [
      { title: "NHAA 14566 - Create New Password (Step 3: Password Update & Success)" },
      { name: "description", content: "NHAA 14566 - Create New Password (Step 3: Password Update & Success) — National Atrocity Helpline & Case Intelligence System portal." },
      { property: "og:title", content: "NHAA 14566 - Create New Password (Step 3: Password Update & Success)" },
      { property: "og:description", content: "NHAA 14566 - Create New Password (Step 3: Password Update & Success) — National Atrocity Helpline & Case Intelligence System portal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewPassword,
});

function NewPassword() {
  const navigate = useNavigate();
  return (
    <div className="bg-govSurface text-govTextDark font-sans min-h-screen flex flex-col justify-between antialiased">


  
  <header className="bg-white border-b border-govBorder shadow-sm px-6 lg:px-12 py-3.5 flex items-center justify-between">
    <div className="flex items-center space-x-6">
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCzJg4Xm1ckNd4oH0khQyLUr-ZFWY82s9SLzxv9EqwX8PonxME0YEW0XzOj2ALodnFYAsADUZ8SEx97A0HOAiW1wXPgHoq1iuaD3WwtpCDhd4WSxhUL1Rs4xxcXnA7slKVCf-VY7Bvq07D9aTLYljsGTDl4tIEl6wMPdWJsTAxjAdbHxRIf8Ty4_GYcy_WoOZNsTEqSSnQKmqXl1nbIr5SRuZ0yubBAdUiXgnmXvpof0igArP9ZNCoX4v2p9KqfFr43A" alt="Ministry of Social Justice & Empowerment" className="h-10 lg:h-12 object-contain" />
      <div className="h-8 w-px bg-govBorder"></div>
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPbfOkec7ZvSCUJBiTgkXZeH6dfmp0f6wj6IhN6QLBeZKZ5QTaPXqSDLFgJtNCc78vEW5NA5YsfniS7ywSc0n3beohJ33Ew8-g5LCGT3zJkhKqQQNnHXNYBFJIHaYM0f8OeXcnuNCAe3Ia9e8sl7PJLTAzvDewKOjk8R1fYPhnPMoeUJYqyzBaEKgHn7Xy1apaa9sm8FP9yNwaciqqe732UWEugDmll5E-iekEeAIgz7P8lKt7uUDAIUKCw9XYr9Zc7A" alt="NHAA 14566" className="h-9 lg:h-11 object-contain" />
    </div>

    <div className="flex items-center space-x-6">
      
      <div className="hidden md:flex items-center space-x-3 text-sm">
        <div className="flex items-center text-green-700 font-semibold">
          <i className="fa-solid fa-circle-check text-green-600 mr-1.5"></i>
          <span>Identify</span>
        </div>
        <i className="fa-solid fa-arrow-right text-xs text-gray-400"></i>
        <div className="flex items-center text-green-700 font-semibold">
          <i className="fa-solid fa-circle-check text-green-600 mr-1.5"></i>
          <span>Verify 2FA</span>
        </div>
        <i className="fa-solid fa-arrow-right text-xs text-gray-400"></i>
        <div className="flex items-center text-govNavy font-semibold">
          <span className="w-6 h-6 rounded-full bg-govNavy text-white flex items-center justify-center text-xs mr-2">3</span>
          <span>New Password</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-xs text-govTextMuted bg-gray-100 py-1.5 px-3 rounded-full border border-gray-200">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span className="font-medium">Secure Handshake Complete</span>
      </div>
    </div>
  </header>

  
  <main className="flex-1 flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-lg">

      
      <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-4 mb-6 shadow-sm flex items-start space-x-3.5">
        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
          <i className="fa-solid fa-check text-sm font-bold"></i>
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-emerald-950">Password Updated Successfully</h2>
          <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
            Your statutory credentials for Officer ID <strong>PRO-001</strong> have been updated and synchronized across the NHAA secure directory.
          </p>
        </div>
      </div>

      
      <div className="bg-white rounded-xl shadow-md border border-govBorder overflow-hidden">
        
        <div className="bg-govNavy text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute right-4 -bottom-4 opacity-10 text-7xl">
            <i className="fa-solid fa-lock"></i>
          </div>
          <div className="inline-flex items-center space-x-2 bg-blue-900/60 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase text-blue-200 mb-3">
            <i className="fa-solid fa-shield-check text-xs text-govAccent"></i>
            <span>Step 3 of 3: Create New Password</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Password</h1>
          <p className="text-sm text-blue-100 mt-1 leading-relaxed">
            Define a strong statutory password meeting Ministry cyber security standards.
          </p>
        </div>

        
        <form className="p-6 sm:p-7 space-y-4">
          
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-govTextDark mb-1.5" htmlFor="new-pass">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <i className="fa-solid fa-lock"></i>
              </div>
              <input 
                type="password" 
                id="new-pass"
                defaultValue="NhaaSec!2026#Gov" 
                className="block w-full pl-10 pr-10 py-3 bg-gray-50 border border-govBorder rounded-lg text-sm text-govTextDark font-medium focus:ring-2 focus:ring-govBlue focus:border-govBlue focus:bg-white transition-colors" 
                placeholder="Enter strong password"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 cursor-pointer hover:text-govNavy">
                <i className="fa-solid fa-eye-slash text-xs"></i>
              </div>
            </div>
          </div>

          
          <div className="bg-gray-50 p-3 rounded-lg border border-govBorder">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-govTextMuted">Statutory Password Strength:</span>
              <span className="text-[11px] font-bold text-emerald-700 flex items-center">
                <i className="fa-solid fa-circle-check mr-1"></i> Very Strong (100%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 flex gap-1">
              <div className="bg-emerald-500 h-1.5 rounded-full flex-1"></div>
              <div className="bg-emerald-500 h-1.5 rounded-full flex-1"></div>
              <div className="bg-emerald-500 h-1.5 rounded-full flex-1"></div>
              <div className="bg-emerald-500 h-1.5 rounded-full flex-1"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-1.5 mt-2.5 text-[11px] text-gray-600">
              <span className="flex items-center text-emerald-700 font-medium">
                <i className="fa-solid fa-check text-xs mr-1 text-emerald-600"></i> Min. 10 characters
              </span>
              <span className="flex items-center text-emerald-700 font-medium">
                <i className="fa-solid fa-check text-xs mr-1 text-emerald-600"></i> Upper & lowercase
              </span>
              <span className="flex items-center text-emerald-700 font-medium">
                <i className="fa-solid fa-check text-xs mr-1 text-emerald-600"></i> Numerical digit (0-9)
              </span>
              <span className="flex items-center text-emerald-700 font-medium">
                <i className="fa-solid fa-check text-xs mr-1 text-emerald-600"></i> Special symbol (!@#$)
              </span>
            </div>
          </div>

          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-govTextDark mb-1.5" htmlFor="conf-pass">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <i className="fa-solid fa-circle-check text-green-600"></i>
              </div>
              <input 
                type="password" 
                id="conf-pass"
                defaultValue="NhaaSec!2026#Gov" 
                className="block w-full pl-10 pr-10 py-3 bg-gray-50 border border-green-500 rounded-lg text-sm text-govTextDark font-medium focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors" 
                placeholder="Re-enter password"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-600">
                <i className="fa-solid fa-check"></i>
              </div>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">Passwords match perfectly.</p>
          </div>

          
          <button 
            type="submit" 
            className="w-full bg-govNavy hover:bg-govBlue text-white font-semibold py-3.5 px-4 rounded-lg shadow transition duration-150 ease-in-out flex items-center justify-center space-x-2 text-sm mt-2" onClick={() => navigate({ to: "/" })}>
            <i className="fa-solid fa-key text-xs"></i>
            <span>Update Password</span>
          </button>

          
          <div className="pt-2">
            <a href="#" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg shadow-sm transition duration-150 ease-in-out flex items-center justify-center space-x-2 text-sm">
              <i className="fa-solid fa-arrow-right-to-bracket text-xs"></i>
              <span>Back to Login with New Password</span>
            </a>
          </div>

          
          <div className="border-t border-gray-100 pt-3 mt-2 flex items-center justify-between text-[11px] text-govTextMuted">
            <span className="flex items-center">
              <i className="fa-solid fa-clock-rotate-left text-blue-600 mr-1.5"></i> Session invalidated on other devices
            </span>
            <span>Policy: NIC-SEC-2026</span>
          </div>

        </form>
      </div>

      
      <div className="text-center mt-5 text-xs text-govTextMuted">
        National Helpline Against Atrocities (NHAA 14566) • Ministry of Social Justice & Empowerment<br/>
        Statutory Security Directive Sec 15A & Cyber Incident Response Framework
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
