import { useState } from 'react';
import './App.css';
import { auth, provider } from './firebase/firebase';
import { signInWithPopup } from 'firebase/auth';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="app">
      {user ? <Dashboard user={user} /> : <AuthForm onAuthSuccess={setUser} />}
    </div>
  );
}

export default App;
