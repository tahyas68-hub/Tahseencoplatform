import { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AIChatbot from './components/AIChatbot';

type PageView = 'landing' | 'dashboard';
export type UserRole = 'admin' | 'student' | 'guest';

export default function App() {
  const [history, setHistory] = useState<{page: PageView, role?: UserRole}[]>([{page: 'landing'}]);
  const current = history[history.length - 1];

  const navigate = (page: PageView, role?: UserRole) => {
    setHistory(prev => [...prev, {page, role: role || current.role}]);
  };

  const goBack = () => {
    setHistory(prev => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans" dir="rtl">
      {current.page === 'landing' ? (
        <LandingPage onLogin={(role) => navigate('dashboard', role)} onGoBack={goBack} showBackBtn={history.length > 1} />
      ) : (
        <Dashboard role={current.role!} onLogout={() => navigate('landing')} onGoBack={goBack} onChangeRole={(role) => navigate('dashboard', role)} />
      )}
      
      {/* Global AI Chatbot visible everywhere as a demo */}
      <AIChatbot />
    </div>
  );
}
