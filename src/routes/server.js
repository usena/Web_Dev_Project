import { handleSessionLogin } from '../routes/session.js';

if (pathname === '/api/sessionLogin' && req.method === 'POST') {
  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', () => handleSessionLogin(req, res, body));
}
