import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LandingPage from './components/LandingPage';
import { initTracking, trackEvent } from './services/tracking';

const Root: React.FC = () => {
  const getPage = () => {
    const path = window.location.pathname;
    if (path === '/quiz' || path.startsWith('/quiz/')) return 'quiz';
    return 'landing';
  };

  const [page, setPage] = useState<'landing' | 'quiz'>(getPage);

  useEffect(() => {
    initTracking();
  }, []);

  useEffect(() => {
    const handlePop = () => setPage(getPage());
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const goToQuiz = () => {
    trackEvent('quiz_start', { cta: 'comecar_teste' });
    window.history.pushState({}, '', '/quiz');
    setPage('quiz');
  };

  if (page === 'quiz') {
    return <App />;
  }

  return <LandingPage onStartQuiz={goToQuiz} />;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
