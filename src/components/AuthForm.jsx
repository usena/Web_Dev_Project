import { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

export default function AuthForm({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [emailType, setEmailType] = useState('personal');
  const [personalEmail, setPersonalEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [id, setId] = useState('');
  const [field, setField] = useState('');

  const generateEmail = () => {
    const [firstName] = fullName.trim().split(' ');
    if (!firstName || !id || !field) return '';
    return `${firstName}.${id}.${field}@gmail.com`.toLowerCase();
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();

    if (emailType === 'personal' && !personalEmail) {
      alert('Please enter your personal email');
      return;
    }
    if (emailType === 'work' && !generateEmail()) {
      alert('Please fill all fields for work email');
      return;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const idToken = await user.getIdToken();

      // Send to backend to create session
      await fetch("http://localhost:5173/api/sessionLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ idToken })
      });

      alert(`Signed in as ${user.email}`);
      onAuthSuccess(user, false);
    } catch (err) {
      console.error(err);
      alert("Failed to authenticate with Google.");
    }
  };

  const handleInternalSignIn = () => {
    const internalUser = {
      email: 'internal@company.com',
      displayName: 'Internal User',
      uid: 'internal123',
    };
    alert(`Signed in as ${internalUser.email}`);
    onAuthSuccess(internalUser, true);
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
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={personalEmail}
            onChange={e => setPersonalEmail(e.target.value)}
          />
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
