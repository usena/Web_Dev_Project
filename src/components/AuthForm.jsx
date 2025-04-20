import { useState } from 'react';
import { auth, provider, db } from "../firebase/firebase";
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailType === 'personal' ? e.target.email.value : generateEmail();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save extra info to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        displayName: user.displayName,
        photoURL: user.photoURL,
        email,
        fullName,
        id,
        field,
        emailType
      });

      onAuthSuccess(user);
    } catch (err) {
      console.error(err);
      alert('Failed to authenticate.');
    }
  };

  return (
    <div className="container">
      <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <select value={emailType} onChange={(e) => setEmailType(e.target.value)}>
          <option value="personal">Personal Email</option>
          <option value="work">Work Email</option>
        </select>

        {emailType === 'personal' ? (
          <input type="email" name="email" placeholder="Enter your email" required />
        ) : (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Field of Work"
              value={field}
              onChange={(e) => setField(e.target.value)}
              required
            />
            <input type="text" value={generateEmail()} readOnly />
          </>
        )}

        <button type="submit">Continue with Google</button>
      </form>
      <div className="switch" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
      </div>
    </div>
  );
}
