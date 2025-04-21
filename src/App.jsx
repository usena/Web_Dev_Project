import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import FormBuilder from './components/FormBuilder';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <AuthForm onAuthSuccess={setUser} />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/form-builder"
            element={user ? <FormBuilder user={user} /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
