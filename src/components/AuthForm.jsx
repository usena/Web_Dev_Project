import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/firebase';

export default function AuthForm({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [emailType, setEmailType] = useState('personal');
  const [fullName, setFullName] = useState('');
  const [id, setId] = useState('');
  const [field, setField] = useState('');

  const generateEmail = () => {
    const [firstName] = fullName.trim().split(' ');
    return `${firstName}.${id}.${field}@gmail.com`.toLowerCase();
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(`Signed in as ${user.email}`);
      onAuthSuccess(user, false); // Not internal
    } catch (err) {
      console.error(err);
      alert('Failed to authenticate with Google.');
    }
  };

  const handleInternalSignIn = () => {
    const internalUser = {
      email: 'internal@company.com',
      displayName: 'Internal User',
      uid: 'internal123',
    };
    alert(`Signed in as ${internalUser.email}`);
    onAuthSuccess(internalUser, true); // Internal user
  };

  return (
    <div className="container">
      <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleGoogleSignIn}>
        <select value={emailType} onChange={(e) => setEmailType(e.target.value)}>
          <option value="personal">Personal Email</option>
          <option value="work">Work Email</option>
        </select>

        {emailType === 'personal' ? (
          <input type="email" name="email" placeholder="Enter your email" />
        ) : (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="text"
              placeholder="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Field of Work"
              value={field}
              onChange={(e) => setField(e.target.value)}
            />
            <input type="text" value={generateEmail()} readOnly />
          </>
        )}

        <button type="submit">Continue with Google</button>
      </form>

      <button onClick={handleInternalSignIn} style={{ marginTop: '10px' }}>
        Sign in as Internal User
      </button>

      <div className="switch" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
      </div>
    </div>
  );
}
