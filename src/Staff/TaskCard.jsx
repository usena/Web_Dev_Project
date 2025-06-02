import React, { useState, useEffect } from 'react';
import './styles.css';

export default function TaskCard({ user }) {
  const [assignModal, setAssignModal] = useState(false);
  const [assignName, setAssignName] = useState('');
  const [assignID, setAssignID] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [addItemModal, setAddItemModal] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [alert, setAlert] = useState(null);
  const [commentModal, setCommentModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [showSenderInfo, setShowSenderInfo] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:5173/api/user/me', {
          headers: {
            'x-auth-token': token,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUserInfo(data);
        } else {
          console.error('Failed to fetch user info');
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    fetchUserInfo();
  }, []);

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

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment.trim()]);
      setNewComment('');
      setCommentModal(false);
      showAlert('Comment added successfully!', 'green');
    }
  };

  return (
    <div className="page">
      {alert && <div className={`alert ${alert.color}`}>{alert.message}</div>}

      <div className="card">
        <div className="header">
          <h2>Token Goes Here*</h2>
          <button className="close-btn">&times;</button>
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
                  <input type="checkbox" checked={item.checked} onChange={() => handleCheckboxChange(index)} />
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
            <li onClick={() => setCommentModal(true)}>
              <span>Add Comment</span>
              <i className="fas fa-arrow-right"></i>
            </li>
            <li onClick={() => setShowSenderInfo(!showSenderInfo)}>
              <span>View Sender Info</span>
              <i className="fas fa-info-circle"></i>
            </li>
          </ul>
          <button
            onClick={() => {
              if (allCompleted) {
                showAlert('Task completed successfully!', 'green');
              } else {
                showAlert('Please complete all checklist items before finishing!', 'red');
              }
            }}
            className="btn green center"
          >
            Finish
          </button>
        </div>

        {showSenderInfo && userInfo && (
          <div className="section">
            <h3>Sender Info</h3>
            <p><strong>Username:</strong> {userInfo.username}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
          </div>
        )}

        {comments.length > 0 && (
          <div className="section">
            <h3>Comments</h3>
            <ul className="comment-list">
              {comments.map((c, i) => (
                <li key={i} className="comment-item">{c}</li>
              ))}
            </ul>
          </div>
        )}

        {commentModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Add Comment</h2>
              <label>Comment</label>
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Enter your comment..."
              />
              <div className="modal-actions">
                <button onClick={() => setCommentModal(false)} className="btn gray">Cancel</button>
                <button onClick={handleAddComment} className="btn blue">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
