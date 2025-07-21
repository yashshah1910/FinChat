import { SignupForm } from "@modelence/auth-ui";
import { Link } from "react-router-dom";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col md:flex-row">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white flex-col justify-center items-center px-12 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
        <div className="relative max-w-sm text-center space-y-8">
          <div className="w-20 h-20 mx-auto bg-white/20 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            Join FinChat
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed">
            Create your account and start managing your finances with AI-powered insights in seconds.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-xs text-blue-100">Fast Setup</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-xs text-blue-100">Smart Goals</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-xs text-blue-100">Secure</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Start your financial journey today</p>
          </div>
          <SignupForm
            renderLoginLink={({ className, children }) => (
              <Link
                to="/auth/login"
                className={`${className} text-blue-600 hover:text-blue-700 font-medium transition-colors`}
              >
                {children}
              </Link>
            )}
            inputClassName="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
            buttonClassName="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            labelClassName="text-sm font-medium text-gray-700"
          />
        </div>
      </div>
    </div>
  );
}
