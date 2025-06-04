// src/api/ticket.js
const API_BASE = 'http://localhost:5173/api/tickets';

export const fetchTicketById = async (id, token) => {
  const res = await fetch(`${API_BASE}/get_ticket_staff/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Failed to fetch ticket');
  return res.json();
};

export const submitTicketResponse = async (id, data, token) => {
  const res = await fetch(`${API_BASE}/submit_response/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to submit response');
  return res.json();
};

export const draftTicketResponse = async (id, data, token) => {
  const res = await fetch(`${API_BASE}/draft_ticket/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to save draft');
  return res.json();
};