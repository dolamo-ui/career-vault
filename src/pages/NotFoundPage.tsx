
// File: src/pages/NotFoundPage.tsx
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./NotFoundPage.css"; // Make sure this import path is correct

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <NavBar onSignIn={() => navigate('/login')} onStart={() => navigate('/register')} />

      <div style={{ padding: "2rem", textAlign: "center", paddingTop: "5rem" }}>
        <h1 className="heartbeat">404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/">Return to Landing Page</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
