import { LoginForm } from "@modelence/auth-ui";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col md:flex-row">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white flex-col justify-center items-center px-12 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
        <div className="relative max-w-sm text-center space-y-8">
          <div className="w-20 h-20 mx-auto bg-white/20 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            Welcome to FinChat
          </h1>
          <p className="text-lg text-emerald-100 leading-relaxed">
            Your AI-powered personal finance assistant. Track expenses, get insights, and manage your money smarter.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-2xl mb-2">🤖</div>
              <div className="text-xs text-emerald-100">AI Assistant</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-xs text-emerald-100">Analytics</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-xs text-emerald-100">Secure</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">Welcome back to FinChat</p>
          </div>
          <LoginForm
            renderSignupLink={({ className, children }) => (
              <Link to="/auth/signup" className={`${className} text-emerald-600 hover:text-emerald-700 font-medium transition-colors`}>
                {children}
              </Link>
            )}
            inputClassName="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm"
            buttonClassName="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 px-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            labelClassName="text-sm font-medium text-gray-700"
          />
        </div>
      </div>
    </div>
  );
}
