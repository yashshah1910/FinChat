import { Link } from 'react-router-dom';
import { modelenceQuery } from '@modelence/react-query';
import { useQuery } from '@tanstack/react-query';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

export default function ExpensesPage() {
  const { data: expensesData, isLoading: expensesLoading } = useQuery(
    modelenceQuery("finchat.getExpenses")
  );
  
  const { data: totalData, isLoading: totalLoading } = useQuery(
    modelenceQuery("finchat.getTotalSpent")
  );

  const loading = expensesLoading || totalLoading;
  
  const handleLogout = () => {
    localStorage.removeItem("modelence.session");
    window.location.href = "/auth/login";
  };
  
  const expenses: Expense[] = (expensesData as any)?.expenses?.map((exp: any) => ({
    id: exp._id,
    amount: exp.amount,
    category: exp.category,
    description: exp.description,
    date: new Date(exp.date)
  })) || [];
  
  const totalSpent = (totalData as any)?.total || 0;
  
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-emerald-500"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Dashboard</h3>
          <p className="text-gray-600">Fetching your expense data...</p>
        </div>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    Food: 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300',
    Transport: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300',
    Shopping: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300',
    Entertainment: 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border border-pink-300',
    Bills: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300',
    Healthcare: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300',
    Other: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-lg border-b border-gray-200 backdrop-blur-sm bg-opacity-95 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">FinChat</h1>
                <p className="text-gray-600 text-sm">Expense Dashboard</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/app/chat"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Chat</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Spent</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">₹{totalSpent.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Categories</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">{Object.keys(categoryTotals).length}</p>
            <p className="text-sm text-gray-500 mt-1">Active categories</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Transactions</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">{expenses.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total records</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Spending by Category</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(categoryTotals).map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[category] || categoryColors.Other}`}>
                      {category}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 text-lg">₹{amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Expenses</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {expenses.map((expense, index) => (
              <div key={expense.id} className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 ${index === 0 ? 'bg-gradient-to-r from-blue-50 to-transparent' : ''}`}>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[expense.category] || categoryColors.Other}`}>
                      {expense.category}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{expense.description}</p>
                    <p className="text-sm text-gray-500 flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{expense.date.toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">₹{expense.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
