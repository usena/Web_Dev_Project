export default function Dashboard({ user }) {
    return (
      <div className="container">
        <h2>Welcome, {user.displayName}!</h2>
        <p>Your email: {user.email}</p>
        <p>This will be your dashboard (form builder, submissions, etc.)</p>
      </div>
    );
  }
  