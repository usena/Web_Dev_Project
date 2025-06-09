import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FormBuilder = () => {
  const [formData, setFormData] = useState({ name: '', age: '', feedback: '' });
  const [feedbackList, setFeedbackList] = useState([]);
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setLoggedIn(false);
      return;
    }
    fetchUser();
    fetchFeedback();
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    }
  }, [loggedIn, navigate]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      alert('Session expired or unauthorized. Please log in again.');
      setLoggedIn(false);
    }
  };

  const fetchFeedback = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/feedback');
      setFeedbackList(res.data);
    } catch (err) {
      console.error('Error fetching feedback:', err);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!token) {
      alert('You must be logged in to submit feedback.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/feedback', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Submitted successfully!');
      setFormData({ name: '', age: '', feedback: '' });
      fetchFeedback();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setUser(null);
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '30px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      boxShadow: '0 0 15px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9f9f9'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Feedback Form</h2>
        <div>
          {user ? (
            <div style={{ marginBottom: '8px' }}>
              <strong>User:</strong> {user.username} ({user.email})
            </div>
          ) : 'Loading user...'}
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#d9534f',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '6px' }}>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <label style={{ display: 'block', marginBottom: '6px' }}>Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <label style={{ display: 'block', marginBottom: '6px' }}>Feedback:</label>
        <textarea
          name="feedback"
          value={formData.feedback}
          onChange={handleChange}
          required
          rows="4"
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
        ></textarea>

        <button
          type="submit"
          style={{
            marginTop: '15px',
            backgroundColor: '#5cb85c',
            border: 'none',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          Submit
        </button>
      </form>

      {/* Submitted Feedback List */}
      <hr style={{ marginBottom: '20px' }} />
      <h3>Submitted Feedback</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {feedbackList.length ? (
          feedbackList.map((item, idx) => (
            <li key={idx} style={{ padding: '10px 0', borderBottom: '1px solid #ddd' }}>
              <strong>{item.name}</strong> ({item.age}): <br />
              <span style={{ whiteSpace: 'pre-wrap' }}>{item.feedback}</span>
            </li>
          ))
        ) : (
          <li>No feedback submitted yet.</li>
        )}
      </ul>
    </div>
  );
};

export default FormBuilder;
