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

export default App;
