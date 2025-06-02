import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FormBuilder = () => {
  const [formData, setFormData] = useState({ name: '', age: '', feedback: '' });
  const [feedbackList, setFeedbackList] = useState([]);
  const [loggedIn, setLoggedIn] = useState(true); // Assume logged in for now

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchFeedback = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/feedback');
      setFeedbackList(res.data);
    } catch (err) {
      console.error('Error fetching feedback:', err);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/feedback', formData);
      alert('Submitted successfully!');
      setFormData({ name: '', age: '', feedback: '' });
      fetchFeedback(); // Refresh list
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setFormData({ name: '', age: '', feedback: '' });
    setFeedbackList([]);
  };

  if (!loggedIn) {
    return <div><h3>You have been logged out.</h3></div>;
  }

  return (
    <div>
      <h2>Feedback Form</h2>
      <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Age:</label><br />
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Feedback:</label><br />
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>

      <hr />
      <h3>Submitted Feedback</h3>
      <ul>
        {feedbackList.map((item, idx) => (
          <li key={idx}>
            <strong>{item.name}</strong> ({item.age}): {item.feedback}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormBuilder;
