import React, { useState, useEffect } from 'react';
import './Styles.css';
import {
  fetchTicketById,
  submitTicketResponse,
  draftTicketResponse,
} from '../api/ticket';

export default function TaskCard({ ticketId }) {
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
  const [senderInfoModal, setSenderInfoModal] = useState(false);
  const [title, setTitle] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5000/api/user/me', {
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

    const fetchTicket = async () => {
      if (!token || !ticketId) return;
      try {
        const data = await fetchTicketById(ticketId, token);
        setTitle(data.title || '');
        setChecklist(data.checklist || []);
        setComments(data.comments || []);
      } catch (err) {
        console.error('Failed to load ticket', err);
        showAlert('Failed to load ticket', 'red');
      }
    };

    fetchUserInfo();
    fetchTicket();
  }, [ticketId, token]);

  const updateProgress = () => {
    const total = checklist.length;
    const completed = checklist.filter(item => item.checked).length;
    return total === 0 ? 0 : (completed / total) * 100;
  };

  const showAlert = (message, color) => {
    setAlert({ message, color });
    setTimeout(() => setAlert(null), 3000);
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

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment.trim()]);
      setNewComment('');
      setCommentModal(false);
      showAlert('Comment added successfully!', 'green');
    }
  };

  const handleSubmit = async () => {
    if (!token || !ticketId) return;

    if (checklist.length > 0 && checklist.every(item => item.checked)) {
      try {
        await submitTicketResponse(ticketId, { title, checklist, comments }, token);
        showAlert('Task submitted successfully!', 'green');
      } catch (err) {
        console.error(err);
        showAlert('Failed to submit task', 'red');
      }
    } else {
      showAlert('Please complete all checklist items!', 'red');
    }
  };

  const handleSaveDraft = async () => {
    if (!token || !ticketId) return;
    try {
      await draftTicketResponse(ticketId, { title, checklist, comments }, token);
      showAlert('Draft saved!', 'green');
    } catch (err) {
      console.error(err);
      showAlert('Failed to save draft', 'red');
    }
  };

  const allCompleted = checklist.length > 0 && checklist.every(item => item.checked);

  return (
    <div className="page">
      {alert && <div className={`alert ${alert.color}`}>{alert.message}</div>}

      <div className="card">
        <div className="header">
          <button className="close-btn">&times;</button>
        </div>

        <div className="section">
          <h3>Title</h3>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter title"
            className="title-input"
          />
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
          <h3>Checklist</h3>
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
          <textarea placeholder="Add important notes..."></textarea>
        </div>

        <div className="section">
          <h3>Actions</h3>
          <ul className="actions">
            <li onClick={() => setCommentModal(true)}>
              <span>Send Comment</span>
              <i className="fas fa-arrow-right"></i>
            </li>
            <li onClick={() => setSenderInfoModal(true)}>
              <span>View Sender Info</span>
              <i className="fas fa-info-circle"></i>
            </li>
          </ul>
          <button onClick={handleSubmit} className="btn green center">Submit</button>
          <button onClick={handleSaveDraft} className="btn yellow center">Save Draft</button>
        </div>

        {senderInfoModal && userInfo && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Sender Information</h2>
              <div className="sender-info">
                <p><strong>Name:</strong> {userInfo.name}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Account ID:</strong> {userInfo.accountId}</p>
                <p><strong>Plan:</strong> {userInfo.plan}</p>
                <p><strong>Status:</strong> {userInfo.status}</p>
              </div>
              <div className="modal-actions">
                <button onClick={() => setSenderInfoModal(false)} className="btn blue">Close</button>
              </div>
            </div>
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
              <h2>Send Comment</h2>
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Enter your comment..."
              />
              <div className="modal-actions">
                <button onClick={() => setCommentModal(false)} className="btn gray">Cancel</button>
                <button onClick={handleAddComment} className="btn blue">Send</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
