import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

// Lazy load views for better performance
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./views/Dashboard').then(m => ({ default: m.Dashboard })));
const Calendar = lazy(() => import('./views/Calendar').then(m => ({ default: m.Calendar })));
const AllTasks = lazy(() => import('./views/AllTasks').then(m => ({ default: m.AllTasks })));
const UserListView = lazy(() => import('./views/UserListView').then(m => ({ default: m.UserListView })));

/**
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

/**
 * Main App component with routing and layout
 */
function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <header className="app-header">
            <ThemeToggle />
          </header>
          <div className="content-area">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/all-tasks" element={<AllTasks />} />
                <Route path="/list/:listId" element={<UserListView />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
