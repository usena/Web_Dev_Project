import React, { useState, useEffect } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

export default function TaskCard() {
  const [assignModal, setAssignModal] = useState(false);
  const [assignName, setAssignName] = useState('');
  const [assignID, setAssignID] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [addItemModal, setAddItemModal] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [alert, setAlert] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwt_decode(token);
      setUserInfo(decoded);
    } catch (err) {
      console.error('Invalid token');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const updateProgress = () => {
    const total = checklist.length;
    const completed = checklist.filter(item => item.checked).length;
    return total === 0 ? 0 : (completed / total) * 100;
  };

  const handleAssignSubmit = () => {
    if (assignName && assignID) {
      showAlert(`Assigned to ${assignName} (ID: ${assignID})`, 'green');
      setAssignModal(false);
      setAssignName('');
      setAssignID('');
    } else {
      showAlert('Please enter both name and ID.', 'red');
    }
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      setChecklist([...checklist, { text: newItemText, checked: false }]);
      setNewItemText('');
      setAddItemModal(false);
    }
  };

  const handleCheckboxChange = index => {
    const updated = [...checklist];
    updated[index].checked = !updated[index].checked;
    setChecklist(updated);
  };

  const showAlert = (message, color) => {
    setAlert({ message, color });
    setTimeout(() => setAlert(null), 3000);
  };

  const allCompleted = checklist.length > 0 && checklist.every(item => item.checked);

  return (
    <div className="page">
      {alert && (
        <div className={`alert ${alert.color}`}>{alert.message}</div>
      )}

      <div className="card">
        <div className="header">
          <h2>{userInfo ? `Welcome, ${userInfo.username}` : 'Loading...'}</h2>
          <button className="btn red" onClick={handleLogout}>Logout</button>
        </div>

        <div className="section">
          <button onClick={() => setAssignModal(true)} className="btn blue">Assign</button>
        </div>

        {assignModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Assign Task</h2>
              <label>Name</label>
              <input value={assignName} onChange={e => setAssignName(e.target.value)} placeholder="Enter name" />
              <label>ID</label>
              <input value={assignID} onChange={e => setAssignID(e.target.value)} placeholder="Enter ID" />
              <div className="modal-actions">
                <button onClick={() => setAssignModal(false)} className="btn gray">Cancel</button>
                <button onClick={handleAssignSubmit} className="btn blue">Assign</button>
              </div>
            </div>
          </div>
        )}

        <div className="section">
          <h3>Description</h3>
          <textarea placeholder="Add a more detailed description..."></textarea>
        </div>

        <div className="section">
          <div className="section-header">
            <h3>Checklist</h3>
            <span className={`badge ${allCompleted ? 'green' : 'yellow'}`}>{allCompleted ? 'Complete' : 'In Progress'}</span>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${updateProgress()}%` }}></div>
          </div>
          <button onClick={() => setHideCompleted(!hideCompleted)} className="toggle-completed">
            {hideCompleted ? 'Show completed items' : 'Hide completed items'}
          </button>
          <ul className="checklist">
            {checklist.map((item, index) => (
              hideCompleted && item.checked ? null : (
                <li key={index} className="checklist-item">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleCheckboxChange(index)}
                  />
                  <span>{item.text}</span>
                </li>
              )
            ))}
          </ul>
          <button onClick={() => setAddItemModal(true)} className="btn green">Add Item</button>
        </div>

        {addItemModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Add Checklist Item</h2>
              <label>Item Text</label>
              <input value={newItemText} onChange={e => setNewItemText(e.target.value)} placeholder="Enter item text" />
              <div className="modal-actions">
                <button onClick={() => setAddItemModal(false)} className="btn gray">Cancel</button>
                <button onClick={handleAddItem} className="btn blue">Add Item</button>
              </div>
            </div>
          </div>
        )}

        <div className="section">
          <h3>Notes</h3>
          <textarea placeholder="Add a more detailed description..."></textarea>
        </div>

        <div className="section">
          <h3>Actions</h3>
          <ul className="actions">
            <li>
              <span>Add Comment</span>
              <i className="fas fa-arrow-right"></i>
            </li>
            <li>
              <span>View Sender Info</span>
              <i className="fas fa-info-circle"></i>
            </li>
          </ul>
          <button onClick={() => {
            if (allCompleted) {
              showAlert('Task completed successfully!', 'green');
            } else {
              showAlert('Please complete all checklist items before finishing!', 'red');
            }
          }} className="btn green center">Finish</button>
        </div>
      </div>
    </div>
  );
}