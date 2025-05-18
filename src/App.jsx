import { useState } from 'react';
import './App.css';
import AuthForm from './components/AuthForm';
import FormBuilder from './components/FormBuilder';
import TaskCard from './TaskCard';

function App() {
  const [user, setUser] = useState(null);
  const [isInternal, setIsInternal] = useState(false);

  const handleAuthSuccess = (user, internal = false) => {
    setUser(user);
    setIsInternal(internal);
  };

  return (
    <div className="app">
      {user ? (
        isInternal ? (
          <TaskCard /> 
        ) : (
          <FormBuilder user={user} /> 
        )
      ) : (
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

useEffect(() => {
  const checkSession = async () => {
    const res = await fetch("http://localhost:5173/api/checkSession", {
      credentials: "include"
    });
    if (res.ok) {
      const user = await res.json();
      onAuthSuccess(user, false); // e.g., sets state to show "logged in"
    }
  };

  checkSession();
}, []);


export default App;
