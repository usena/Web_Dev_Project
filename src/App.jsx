import { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import FormBuilder from './components/FormBuilder';
import TaskCard from './TaskCard';

function App() {
  const [user, setUser] = useState(null);
  const [isInternal, setIsInternal] = useState(false);

  // Called when login succeeds (either internal or Google)
  const handleAuthSuccess = (user, internal = false) => {
    setUser(user);
    setIsInternal(internal);
  };

  // Optional: logout function clears user state
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsInternal(false);
  };

  // Check session on app load
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("http://localhost:5173/api/checkSession", {
          credentials: "include"
        });
        if (res.ok) {
          const user = await res.json();
          handleAuthSuccess(user, false);
        }
      } catch (error) {
        console.error("Session check failed", error);
      }
    }
    checkSession();
  }, []);

  // Show components based on user + internal flag
  return (
    <div className="app">
      {user ? (
        isInternal ? (
          <TaskCard user={user} onLogout={handleLogout} />
        ) : (
          <FormBuilder user={user} onLogout={handleLogout} />
        )
      ) : (
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;
