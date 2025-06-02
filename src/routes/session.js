import { adminAuth } from '../.gitignore/firebaseAdmin.js';
import { serialize, parse as parseCookies } from 'cookie';

export async function handleSessionLogin(req, res, body) {
  try {
    const { idToken } = JSON.parse(body);
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    res.setHeader('Set-Cookie', serialize('session', sessionCookie, {
      httpOnly: true,
      secure: false,
      maxAge: expiresIn / 1000,
      path: '/',
    }));
    res.writeHead(200);
    res.end('Session set');
  } catch (err) {
    console.error(err);
    res.writeHead(401);
    res.end('Unauthorized');
  }
}
