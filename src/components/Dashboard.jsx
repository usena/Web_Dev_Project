import { Link } from 'react-router-dom';

function Dashboard({ user }) {
  return (
    <div>
      <h2>Welcome, {user.displayName || user.email}</h2>
      <Link to="/form-builder">
        <button>Create New Form</button>
      </Link>
    </div>
  );
}
export default Dashboard;