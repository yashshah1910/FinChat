import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">💰 FinChat</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/auth/login"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                to="/auth/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Your AI-Powered
            <br />
            <span className="text-blue-600">Personal Finance Assistant</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track expenses naturally with simple messages like "₹500 pizza". 
            Get intelligent insights, categorization, and financial advice powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              Start Tracking Now
            </Link>
            <Link
              to="/auth/login"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Natural Language Input</h3>
            <p className="text-gray-600">
              Just type "₹500 pizza" and let AI handle the categorization and tracking.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-gray-600">
              Get intelligent spending analysis and personalized financial advice.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Smart Dashboard</h3>
            <p className="text-gray-600">
              Visualize your spending patterns and track your financial goals.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
